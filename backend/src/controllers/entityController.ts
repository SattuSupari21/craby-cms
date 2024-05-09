import { Request, Response } from "express"
import client from "../db";

// @ts-ignore
function generateDBQuery(entityName: string, attributes) {
    let query = `CREATE TABLE IF NOT EXISTS ${entityName} (`;
    const attributeQuery = generateAttributesQuery(attributes);

    query += attributeQuery;

    return query;
}

// @ts-ignore
function generateAttributesQuery(attributes) {
    let query = "";
    for (const [attribute_name, _] of Object.entries(attributes)) {
        query += `${attribute_name}` + " ";
        for (const [property_name, property_value] of Object.entries(attributes[attribute_name])) {
            if (property_name === "type") {
                if (property_value === "text") query += "TEXT "
                else if (property_value === "numeric") query += "NUMERIC "
                else if (property_value === "serial") query += "SERIAL "
                else if (property_value === "date") query += "DATE "
            } else {
                if (property_name === "primary" && property_value === true) query += "PRIMARY KEY "
                if (property_name === "unique" && property_value === true) query += "UNIQUE "
                if (property_name === "notNull" && property_value === true) query += "NOT NULL "
            }
        }
        query = query.trim();
        query += ", "
    }
    query = query.trim().slice(0, -1) + ");".trim();

    return query;
}

export const getAllTables = async (req: Request, res: Response) => {
    try {
        const result = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
        if (result.rows.length === 0) {
            return res.json()
        }
        return res.json(result.rows[0])
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
        const query = "SELECT EXISTS ( SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ($1));"
        const table = await client.query(query, [entityName])
        if (table.rows[0]['exists'] === true) {
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
