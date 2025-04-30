import supertest from "supertest";
import app from "../../src/app";

const api = supertest(app);

describe("GET /news/:id", () => {
  it("should return 400 when id is NaN", async () => {
    const res = await api.get("/news/abc");
    expect(res.status).toBe(400);
  });

  it("should return 400 when id is 0", async () => {
    const res = await api.get("/news/0");
    expect(res.status).toBe(400);
  });
});
