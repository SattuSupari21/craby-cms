import { Request, Response } from "express"
import client from "../db";

async function getTableColumns(table_name: string) {
    let columns = []
    const query = "select column_name, data_type from INFORMATION_SCHEMA.COLUMNS where table_name=($1)";
    const result = await client.query(query, [table_name]);
    for (const [_, value] of Object.entries(result.rows)) {
        for (const [col_type, col_value] of Object.entries(value)) {
            if (col_type === "column_name") columns.push(col_value)
        }
    }
    return columns
}

export const insertInTable = async (req: Request, res: Response) => {
    const { table_name, attributes } = req.body;
    const columns = await getTableColumns(table_name)
    const valuesToInsert = []
    for (const [_, value] of Object.entries(columns)) {
        const index = value as string
        valuesToInsert.push(attributes[index])
    }
    try {
        const insertQuery = {
            text: "INSERT INTO " + table_name + "(" + columns.toString() + ")" + " VALUES($1, $2, $3)",
            values: valuesToInsert
        }
        const queryResult = await client.query(insertQuery);
        return res.json(queryResult)
    } catch (e) {
        return res.json({ error: e })
    }
}
