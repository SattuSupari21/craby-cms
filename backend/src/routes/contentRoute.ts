import { Router } from "express";
import { deleteFromTable, insertInTable, readFromTable, updateInTable } from "../controllers/contentController";

const contentRouter = Router();

contentRouter.route('/insertInTable').post(insertInTable);
contentRouter.route('/readFromTable').post(readFromTable);
contentRouter.route('/deleteFromTable').delete(deleteFromTable);
contentRouter.route('/updateInTable').put(updateInTable);

export default contentRouter;
