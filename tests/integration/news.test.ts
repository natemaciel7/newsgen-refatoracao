import supertest from "supertest";
import app from "../../src/app";
import prisma from "../../src/database";
import { persistNewRandomNews } from "../factories/news-factory";

const server = supertest(app);

beforeEach(async () => {
  await prisma.news.deleteMany({});
});

describe("GET /news", () => {
  it("deve retornar no máximo 10 notícias por padrão", async () => {
    for (let i = 0; i < 15; i++) await persistNewRandomNews();
    const res = await server.get("/news");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(10);
  });

  it("deve retornar a próxima página com page=2", async () => {
    for (let i = 0; i < 15; i++) await persistNewRandomNews();
    const resPage1 = await server.get("/news?page=1");
    const resPage2 = await server.get("/news?page=2");
    expect(resPage2.status).toBe(200);
    expect(resPage2.body.length).toBeGreaterThan(0);
    expect(resPage1.body[0].id).not.toBe(resPage2.body[0].id);
  });

  it("deve retornar as notícias ordenadas por publicationDate (asc)", async () => {
    for (let i = 0; i < 5; i++) await persistNewRandomNews();
    const res = await server.get("/news?order=asc");
    expect(res.status).toBe(200);
    const dates = res.body.map((n) => new Date(n.publicationDate).getTime());
    const sorted = [...dates].sort((a, b) => a - b);
    expect(dates).toEqual(sorted);
  });

  it("deve filtrar notícias por título (case-insensitive)", async () => {
    await prisma.news.create({
      data: {
        title: "Breaking News: Driven School",
        text: "a".repeat(600),
        author: "Test",
        publicationDate: new Date(Date.now() + 100000),
        firstHand: true,
      },
    });

    const res = await server.get("/news?title=driven");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title.toLowerCase()).toContain("driven");
  });

  it("deve retornar [] se nenhum título for encontrado", async () => {
    const res = await server.get("/news?title=inexistente");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
