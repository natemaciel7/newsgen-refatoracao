import * as service from "../../src/services/news-service";
import prisma from "../../src/database";
import { NewsData } from "../../src/repositories/news-repository";

const mockNews: NewsData = {
  title: "Título",
  text: "a".repeat(600),
  author: "Autor",
  firstHand: true,
  publicationDate: new Date(Date.now() - 100000), // data no passado
};

describe("news-service branch coverage", () => {
  it("should throw BadRequest if date is in the past", async () => {
    jest.spyOn(prisma.news, "findFirst").mockResolvedValue(null); // sem conflito
    await expect(service.createNews(mockNews)).rejects.toMatchObject({
      name: "BadRequest",
    });
  });
});
