import { Request, Response } from "express";
import httpStatus from "http-status";

import * as newsService from "../services/news-service";
import { NewsData } from "../repositories/news-repository";

const ERROR_INVALID_ID = "Id is not valid.";

function parseAndValidateId(req: Request, res: Response): number | undefined {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    res.status(httpStatus.BAD_REQUEST).send(ERROR_INVALID_ID);
    return;
  }
  return id;
}

export async function getAllNews(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const order =
    (req.query.order as string)?.toLowerCase() === "asc" ? "asc" : "desc";
  const title = req.query.title as string | undefined;

  const newsList = await newsService.getAllNews({ page, order, title });
  return res.send(newsList);
}

export async function getNewsById(req: Request, res: Response) {
  const id = parseAndValidateId(req, res);
  if (!id) return;

  const news = await newsService.getNewsById(id);
  return res.send(news);
}

export async function createNews(req: Request, res: Response) {
  const newsData = req.body as NewsData;
  const newNews = await newsService.createNews(newsData);
  return res.status(httpStatus.CREATED).send(newNews);
}

export async function updateNews(req: Request, res: Response) {
  const id = parseAndValidateId(req, res);
  if (!id) return;

  const newsData = req.body as NewsData;
  const updatedNews = await newsService.updateNews(id, newsData);
  return res.send(updatedNews);
}

export async function deleteNews(req: Request, res: Response) {
  const id = parseAndValidateId(req, res);
  if (!id) return;

  await newsService.deleteNews(id);
  return res.sendStatus(httpStatus.NO_CONTENT);
}
