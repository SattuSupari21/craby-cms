import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import client from "./db";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())

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

app.get('/getAllTables', async (req: Request, res: Response) => {
    try {
        const result = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
        return res.json(result.rows)
    } catch (e) {
        return res.json({ error: e })
    }
})

app.get("/getTableSchema", async (req: Request, res: Response) => {
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
});

app.post("/createTable", async (req: Request, res: Response) => {
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
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
