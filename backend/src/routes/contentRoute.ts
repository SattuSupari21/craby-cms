import { Router } from "express";
import { deleteFromTable, insertInTable, readFromTable } from "../controllers/contentController";

const contentRouter = Router();

contentRouter.route('/insertInTable').post(insertInTable);
contentRouter.route('/readFromTable').get(readFromTable);
contentRouter.route('/deleteFromTable').get(deleteFromTable);

export default contentRouter;
