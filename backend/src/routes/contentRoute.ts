import { Router } from "express";
import { deleteFromTable, insertInTable, readFromTable, updateInTable } from "../controllers/contentController";

const contentRouter = Router();

contentRouter.route('/insertInTable').post(insertInTable);
contentRouter.route('/readFromTable').get(readFromTable);
contentRouter.route('/deleteFromTable').get(deleteFromTable);
contentRouter.route('/updateInTable').post(updateInTable);

export default contentRouter;
