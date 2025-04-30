import * as service from "../../src/services/news-service";
import * as repository from "../../src/repositories/news-repository";
import { NewsData } from "../../src/repositories/news-repository";
import prisma from "../../src/database";

const mockNews: NewsData = {
  title: "Notícia Teste",
  text: "a".repeat(600),
  author: "Autor Exemplo",
  firstHand: true,
  publicationDate: new Date(Date.now() + 100000),
};

describe("news-service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createNews", () => {
    it("should create news when valid and title is unique", async () => {
      jest.spyOn(prisma.news, "findFirst").mockResolvedValue(null);
      jest.spyOn(repository, "createNews").mockResolvedValueOnce({
        id: 1,
        ...mockNews,
        createAt: new Date(),
      });

      const result = await service.createNews(mockNews);
      expect(result).toHaveProperty("id", 1);
    });

    it("should throw Conflict when title already exists", async () => {
      jest.spyOn(prisma.news, "findFirst").mockResolvedValueOnce({
        id: 1,
        ...mockNews,
        createAt: new Date(),
      });

      await expect(service.createNews(mockNews)).rejects.toMatchObject({
        name: "Conflict",
      });
    });

    it("should throw BadRequest when text is too short", async () => {
      const shortNews = { ...mockNews, text: "curto" };
      jest.spyOn(prisma.news, "findFirst").mockResolvedValue(null);

      await expect(service.createNews(shortNews)).rejects.toMatchObject({
        name: "BadRequest",
      });
    });

    it("should throw BadRequest when publication date is in the past", async () => {
      const pastNews = {
        ...mockNews,
        publicationDate: new Date(Date.now() - 100000),
      };
      jest.spyOn(prisma.news, "findFirst").mockResolvedValue(null);

      await expect(service.createNews(pastNews)).rejects.toMatchObject({
        name: "BadRequest",
      });
    });
  });

  describe("getSpecificNews", () => {
    it("should return news if found", async () => {
      jest.spyOn(repository, "getNewsById").mockResolvedValueOnce({
        id: 1,
        ...mockNews,
        createAt: new Date(),
      });

      const result = await service.getSpecificNews(1);
      expect(result).toHaveProperty("id", 1);
    });

    it("should throw NotFound if news does not exist", async () => {
      jest.spyOn(repository, "getNewsById").mockResolvedValue(null);

      await expect(service.getSpecificNews(999)).rejects.toMatchObject({
        name: "NotFound",
      });
    });
  });

  describe("updateNews", () => {
    it("should update when title is not changed", async () => {
      const original = {
        id: 1,
        ...mockNews,
        createAt: new Date(),
      };

      jest.spyOn(repository, "getNewsById").mockResolvedValue(original);
      jest.spyOn(repository, "updateNews").mockResolvedValueOnce({
        ...original,
        text: "a".repeat(600) + " atualizado",
      });

      const result = await service.updateNews(1, mockNews);
      expect(result.text).toContain("atualizado");
    });

    it("should throw Conflict when new title already exists", async () => {
      const original = {
        id: 1,
        ...mockNews,
        title: "Título Antigo",
        createAt: new Date(),
      };

      const newData = {
        ...mockNews,
        title: "Título Novo",
      };

      jest.spyOn(repository, "getNewsById").mockResolvedValue(original);
      jest.spyOn(prisma.news, "findFirst").mockResolvedValueOnce({
        id: 2,
        ...newData,
        createAt: new Date(),
      });

      await expect(service.updateNews(1, newData)).rejects.toMatchObject({
        name: "Conflict",
      });
    });
  });
});
