import Joi from "joi";
import { NewsData } from "../repositories/news-repository";

export const newsSchema = Joi.object<NewsData>({
  title: Joi.string().required(),
  text: Joi.string().min(500).required(),
  author: Joi.string().required(),
  firstHand: Joi.boolean().optional(),
  publicationDate: Joi.date().greater("now").required(),
});
