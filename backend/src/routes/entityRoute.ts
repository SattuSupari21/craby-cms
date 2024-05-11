import { Router } from "express";
import { createTable, deleteTable, getAllTables, getTableSchema } from "../controllers/entityController";

const entityRouter = Router();

entityRouter.route('/getAllTables').get(getAllTables)
entityRouter.route('/getTableSchema').post(getTableSchema)
entityRouter.route('/createTable').post(createTable)
entityRouter.route('/deleteTable').post(deleteTable)

export default entityRouter;
