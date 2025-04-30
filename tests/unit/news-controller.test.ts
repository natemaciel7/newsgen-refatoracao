import supertest from "supertest";
import app from "../../src/app";
import prisma from "../../src/database";
import { faker } from "@faker-js/faker";

const api = supertest(app);

beforeEach(async () => {
  await prisma.news.deleteMany();
});

describe("News Controller", () => {
  it("should return 400 if id param is invalid", async () => {
    const res = await api.get("/news/abc");
    expect(res.status).toBe(400);
  });

  it("should return 404 if id does not exist", async () => {
    const res = await api.get("/news/9999");
    expect(res.status).toBe(404);
  });

  it("should create a news entry", async () => {
    const body = {
      title: faker.lorem.words(6),
      text: faker.lorem.paragraphs(6),
      author: faker.person.fullName(),
      publicationDate: new Date(Date.now() + 100000).toISOString(),
      firstHand: false,
    };
    const res = await api.post("/news").send(body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should delete a news entry", async () => {
    const created = await prisma.news.create({
      data: {
        title: faker.lorem.words(6),
        text: faker.lorem.paragraphs(6),
        author: faker.person.fullName(),
        publicationDate: new Date(Date.now() + 100000),
        firstHand: true,
      },
    });
    const res = await api.delete(`/news/${created.id}`);
    expect(res.status).toBe(204);
  });
});
