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
export const readFromTable = async (req: Request, res: Response) => {

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
