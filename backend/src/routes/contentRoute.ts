import { Router } from "express";
import { deleteFromTable, getPrimaryKey, insertInTable, readFromTable, readFromTableById, updateInTable } from "../controllers/contentController";

const contentRouter = Router();

contentRouter.route('/getPrimaryKey').post(getPrimaryKey);
contentRouter.route('/insertInTable').post(insertInTable);
contentRouter.route('/readFromTable').post(readFromTable);
contentRouter.route('/readFromTableById').post(readFromTableById);
contentRouter.route('/deleteFromTable').delete(deleteFromTable);
contentRouter.route('/updateInTable').put(updateInTable);

export default contentRouter;
