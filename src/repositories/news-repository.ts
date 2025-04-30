import prisma from "../database";
import { News } from "@prisma/client";

export type NewsData = Omit<News, "id" | "createAt">;

export function getAllNews({
  skip,
  take,
  order,
  title,
}: {
  skip: number;
  take: number;
  order: "asc" | "desc";
  title?: string;
}) {
  return prisma.news.findMany({
    where: title
      ? { title: { contains: title, mode: "insensitive" } }
      : undefined,
    orderBy: { publicationDate: order },
    skip,
    take,
  });
}

export function getNewsById(id: number) {
  return prisma.news.findUnique({ where: { id } });
}

export async function createNews(newsData: NewsData) {
  return prisma.news.create({
    data: { ...newsData, publicationDate: new Date(newsData.publicationDate) },
  });
}

export async function updateNews(id: number, newsData: NewsData) {
  return prisma.news.update({
    where: { id },
    data: { ...newsData, publicationDate: new Date(newsData.publicationDate) },
  });
}

export async function deleteNews(id: number) {
  return prisma.news.delete({ where: { id } });
}
