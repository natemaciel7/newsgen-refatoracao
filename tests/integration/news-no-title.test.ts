import supertest from "supertest";
import app from "../../src/app";
import prisma from "../../src/database";
import { persistNewRandomNews } from "../factories/news-factory";

const api = supertest(app);

beforeAll(async () => {
  await prisma.news.deleteMany({});
  await persistNewRandomNews();
});

describe("GET /news without title filter", () => {
  it("should return all news when no title is provided", async () => {
    const res = await api.get("/news");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
