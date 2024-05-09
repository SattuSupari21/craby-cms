import { Router } from "express";
import { insertInTable } from "../controllers/contentController";

const contentRouter = Router();

contentRouter.route('/insertInTable').post(insertInTable);

export default contentRouter;
