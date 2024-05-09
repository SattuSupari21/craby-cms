import { Router } from "express";
import { createTable, getAllTables, getTableSchema } from "../controllers/entityController";

const entityRouter = Router();

entityRouter.route('/getAllTables').get(getAllTables)
entityRouter.route('/getTableSchema').get(getTableSchema)
entityRouter.route('/createTable').post(createTable)

export default entityRouter;
