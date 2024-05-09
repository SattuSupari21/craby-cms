import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import entityRouter from "./routes/entityRoute";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())

app.use('/api/entity', entityRouter)

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
