import { Request, Response } from "express"
import client from "../db";

// @ts-ignore
function generateDBQuery(entityName: string, attributes): string {
    let query = `CREATE TABLE IF NOT EXISTS ${entityName} (`;
    const attributeQuery = generateAttributesQuery(attributes);

    query += attributeQuery;

    return query;
}

// @ts-ignore
function generateAttributesQuery(attributes): string {
    let query = "";
    for (const [attribute_name, _] of Object.entries(attributes)) {
        query += `${attribute_name}` + " ";
        const type = attributes[attribute_name]["type"];
        const primary = attributes[attribute_name]["primary"];
        const unique = attributes[attribute_name]["unique"];
        const notNull = attributes[attribute_name]["notNull"];
        const defaultVal = attributes[attribute_name]["default"];

        switch (type) {
            case "uuid":
                query += "UUID ";
                break;
            case "text":
                query += "TEXT ";
                break;
            case "numeric":
                query += "NUMERIC ";
                break;
            case "serial":
                query += "SERIAL ";
                break;
            case "date":
                query += "DATE ";
                break;
        }

        if (primary && type === "uuid") {
            query += "PRIMARY KEY DEFAULT gen_random_uuid(), ";
            continue;
        }
        if (primary) query += "PRIMARY KEY "
        if (unique) query += "UNIQUE "
        if (notNull) query += "NOT NULL "
        if (defaultVal) query += "DEFAULT '" + defaultVal + "'"

        query += ", "
    }
    query = query.trim().slice(0, -1) + ");".trim();

    return query;
}

async function checkTableAlreadyExists(entityName: string): Promise<Boolean> {
    const query = "SELECT EXISTS ( SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ($1));"
    const table = await client.query(query, [entityName])
    if (table.rows[0]['exists'] === true) {
        return true;
    }
    return false;
}

export const getAllTables = async (req: Request, res: Response) => {
    const allTables = []
    try {
        const result = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
        if (result.rows.length === 0) {
            return res.json({ tables: [] })
        }
        for (const [_, value] of Object.entries(result.rows)) {
            allTables.push(value['table_name'])
        }
        return res.json({ tables: allTables })
    } catch (e) {
        return res.json({ error: e })
    }
}

export const getTableSchema = async (req: Request, res: Response) => {
    try {
        let columns = []
        let dataTypes = []
        const query = "select column_name, data_type from INFORMATION_SCHEMA.COLUMNS where table_name=($1)";
        const result = await client.query(query, [req.body.table_name]);
        for (const [_, value] of Object.entries(result.rows)) {
            for (const [col_type, col_value] of Object.entries(value)) {
                if (col_type === "column_name") columns.push(col_value)
                else if (col_type === "data_type") dataTypes.push(col_value)
            }
        }
        return res.json({ columns, dataTypes })
    } catch (e) {
        return res.json({ error: e })
    }
}

export const createTable = async (req: Request, res: Response) => {
    const { entityName, attributes } = req.body;
    const pgQuery = generateDBQuery(entityName, attributes);

    // check if table already exists
    try {
        if (await checkTableAlreadyExists(entityName) === true) {
            return res.json({ error: "Table already exists" })
        }
    } catch (e) {
        return res.json({ status: "error" })
    }

    try {
        const dbResponse = await client.query(pgQuery)
        res.json({ status: "success", message: dbResponse })
    } catch (e) {
        return res.json({ error: "error" })
    }
}

export const deleteTable = async (req: Request, res: Response) => {
    const table_name = req.body.table_name;
    try {
        if (await checkTableAlreadyExists(table_name) === false) {
            return res.json({ error: "Table does not exist" })
        }
        const query = "DROP TABLE ";
        await client.query(query + table_name)
        return res.json({ status: "success", message: "Table deleted successfully" })
    } catch (e) {
        return res.json({ error: "error" })
    }
}
