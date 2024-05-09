import { Router } from "express";
import { insertInTable, readFromTable } from "../controllers/contentController";

const contentRouter = Router();

contentRouter.route('/insertInTable').post(insertInTable);
contentRouter.route('/readFromTable').post(readFromTable);

export default contentRouter;
