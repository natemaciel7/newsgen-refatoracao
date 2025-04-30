import prisma from "../database";
import * as newsRepository from "../repositories/news-repository";
import { NewsData } from "../repositories/news-repository";

function createAppError(name: string, message: string): Error {
  const error = new Error(message);
  error.name = name;
  return error;
}

export async function getAllNews({
  page,
  order,
  title,
}: {
  page: number;
  order: "asc" | "desc";
  title?: string;
}) {
  const PAGE_SIZE = 10;
  const skip = (page - 1) * PAGE_SIZE;
  return newsRepository.getAllNews({ skip, take: PAGE_SIZE, order, title });
}

export async function getNewsById(id: number) {
  const news = await newsRepository.getNewsById(id);
  if (!news) throw createAppError("NotFound", `News with id ${id} not found.`);
  return news;
}

export async function createNews(newsData: NewsData) {
  await validateNewsData(newsData, true);
  return newsRepository.createNews(newsData);
}

export async function updateNews(id: number, newsData: NewsData) {
  const existingNews = await getNewsById(id);
  const titleChanged = existingNews.title !== newsData.title;
  await validateNewsData(newsData, titleChanged);
  return newsRepository.updateNews(id, newsData);
}

export async function deleteNews(id: number) {
  await getNewsById(id);
  return newsRepository.deleteNews(id);
}

async function validateNewsData(
  newsData: NewsData,
  shouldCheckTitleConflict = true
) {
  if (shouldCheckTitleConflict) {
    const existing = await prisma.news.findFirst({
      where: { title: newsData.title },
    });
    if (existing)
      throw createAppError(
        "Conflict",
        `News with title "${newsData.title}" already exists.`
      );
  }
  if (newsData.text.length < 500) {
    throw createAppError(
      "BadRequest",
      "The news text must be at least 500 characters long."
    );
  }
  const now = new Date();
  const publicationDate = new Date(newsData.publicationDate);
  if (publicationDate.getTime() < now.getTime()) {
    throw createAppError(
      "BadRequest",
      "The publication date cannot be in the past."
    );
  }
}
