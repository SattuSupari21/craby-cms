import { Request, Response } from "express"
import client from "../db";

async function getTableColumns(table_name: string) {
    let columns = []
    let defaults = []
    const query = "select column_default, column_name, data_type from INFORMATION_SCHEMA.COLUMNS where table_name=($1)";
    const result = await client.query(query, [table_name]);
    for (const [_, value] of Object.entries(result.rows)) {
        for (const [col_type, col_value] of Object.entries(value)) {
            if (col_type === "column_name") columns.push(col_value)
            else if (col_type === "column_default") defaults.push(col_value)
        }
    }
    return { columns, defaults }
}

async function getTableData(table_name: string) {
    const query = "SELECT * FROM " + table_name;
    try {
        const result = await client.query(query);
        return { data: result.rows };
    } catch (e) {
        return { error: e };
    }
}

async function getPrimaryKeyFromTable(table_name: string) {
    // query to find primary key column
    // official docs -> https://wiki.postgresql.org/wiki/Retrieve_primary_key_columns
    const query = "SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS data_type FROM pg_index i JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey) WHERE  i.indrelid = " + "'" + table_name + "'" + " :: regclass AND i.indisprimary; ";
    const result = await client.query(query)
    return result.rows[0]["attname"];
}

export const getPrimaryKey = async (req: Request, res: Response) => {
    const { table_name } = req.body;
    const pk = await getPrimaryKeyFromTable(table_name)
    return res.json({ pk })
}

export const readFromTable = async (req: Request, res: Response) => {
    const { table_name } = req.body;
    const tableData = await getTableData(table_name);
    return res.json(tableData)
}

export const readFromTableById = async (req: Request, res: Response) => {
    const { table_name, id } = req.body;
    const pk = await getPrimaryKeyFromTable(table_name)
    try {
        const query = "SELECT * FROM " + table_name + " WHERE " + pk + "=($1)";
        const result = await client.query(query, [id]);
        return res.json({ data: result.rows })
    } catch (e) {
        return res.json({ error: e })
    }

}

export const deleteFromTable = async (req: Request, res: Response) => {
    const { table_name, id } = req.body;
    const primaryKey = await getPrimaryKeyFromTable(table_name)

    if (!id) {
        return res.json({ error: "Primary key required" });
    }

    try {
        const query = "SELECT * FROM " + table_name + " WHERE " + primaryKey + "=($1)";
        const result = await client.query(query, [id]);
        if (result.rows.length < 1) {
            throw new Error()
        }
    } catch (e) {
        return res.json({ error: "Invalid Value" })
    }

    try {
        const query = "DELETE FROM " + table_name + " WHERE " + primaryKey + "=($1)";
        await client.query(query, [id]);
        return res.json({ status: "success", message: "Entry deleted successfully" });
    } catch (e) {
        return res.json({ error: e })
    }
}

export const updateInTable = async (req: Request, res: Response) => {
    const { table_name, attributes, id } = req.body;
    const { columns } = await getTableColumns(table_name)
    const primaryKey = await getPrimaryKeyFromTable(table_name)

    if (!id) {
        return res.json({ error: "Primary key required" });
    }

    try {
        const query = "SELECT * FROM " + table_name + " WHERE " + primaryKey + "=($1)";
        const result = await client.query(query, [id]);
        if (result.rows.length < 1) {
            throw new Error()
        }
    } catch (e) {
        return res.json({ error: "Invalid Value" })
    }

    columns.shift()
    try {
        let query = "UPDATE " + table_name + " SET ";
        let colAndValue = ""
        for (let i = 0; i < columns.length; i++) {
            const index = columns[i] as string
            colAndValue += columns[i] + "=" + "'" + attributes[index] + "'" + ","
        }
        colAndValue = colAndValue.slice(0, -1)
        query += colAndValue + " WHERE " + primaryKey + "=($1)";
        await client.query(query, [id]);
        return res.json({ status: "success", message: "Entry updated successfully" });
    } catch (e) {
        return res.json({ error: e })
    }
}

export const insertInTable = async (req: Request, res: Response) => {
    const { table_name, attributes } = req.body;
    const { columns, defaults } = await getTableColumns(table_name)
    const valuesToInsert = []
    for (const [_, value] of Object.entries(columns)) {
        const index = value as string
        valuesToInsert.push(attributes[index])
    }
    // removing id column if its has a auto value generation
    if (defaults[0] === "gen_random_uuid()") {
        columns.shift()
        valuesToInsert.shift()
    }
    let text = "INSERT INTO " + table_name + "(" + columns.toString() + ")" + " VALUES("
    let valuesText = ""
    for (let i = 1; i <= columns.length; i++) {
        valuesText += `$${i},`
    }
    text += valuesText.slice(0, -1) + ");"
    try {
        const insertQuery = {
            text,
            values: valuesToInsert
        }
        const queryResult = await client.query(insertQuery);
        return res.json(queryResult)
    } catch (e) {
        return res.json({ error: e })
    }
}
