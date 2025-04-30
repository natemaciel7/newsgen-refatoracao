import { Router } from "express";
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/news-controller";

import { validateSchemaMiddleware } from "../middlewares/schema-handler";
import { newsSchema } from "../schemas/news-schema";

const newsRouter = Router();

newsRouter.get("/", getAllNews);
newsRouter.get("/:id", getNewsById);
newsRouter.post("/", validateSchemaMiddleware(newsSchema), createNews);
newsRouter.put("/:id", validateSchemaMiddleware(newsSchema), updateNews);
newsRouter.delete("/:id", deleteNews);

export default newsRouter;
