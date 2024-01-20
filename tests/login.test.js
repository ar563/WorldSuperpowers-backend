const request = require("supertest");

const app = require("../app");

describe("Test the login path", () => {
  test("It should response the GET method without authorization", async () => {
    const response = await request(app).get("/api/login");
    expect(response.statusCode).toBe(403);
  });

  test("It should response the GET method with authorization", async () => {
    const buff = Buffer.from("test:test", "utf-8");
    const response = await request(app)
      .get("/api/login")
      .set("Authorization", buff.toString("base64"));
    expect(response.statusCode).toBe(200);
  });
});
