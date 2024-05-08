import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

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
    for (const [attribute_name, attribute_value] of Object.entries(attributes)) {
        query += `${attribute_name}` + " ";
        for (const [property_name, property_value] of Object.entries(attributes[attribute_name])) {
            if (property_name === "type") {
                if (property_value === "string") query += "VARCHAR(100) "
                else if (property_value === "number") query += "NUMBER "
                else if (property_value === "serial") query += "SERIAL "
                else if (property_value === "date") query += "DATE "
            }
            else if (property_name === "primary" && property_value === true) query += "PRIMARY KEY "
            else if (property_name === "unique" && property_value === true) query += "UNIQUE "
            else if (property_name === "notNull" && property_value === true) query += "NOT NULL "
        }
        query = query.trim();
        query += ", "
    }
    query = query.trim().slice(0, -1) + ");".trim();

    return query;
}

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.post("/createTable", async (req: Request, res: Response) => {
    const { entityName, attributes } = req.body;
    const pgQuery = generateDBQuery(entityName, attributes);
    return res.json({ pgQuery })
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
