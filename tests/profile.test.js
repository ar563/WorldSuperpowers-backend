const request = require("supertest");

const app = require("../app");

describe("Test the profile path", () => {
  test("It should response the GET method", async () => {
    const response = await request(app).get("/api/profile/admin");
    expect(response.statusCode).toBe(200);
  });

  test("It should return proper username", async () => {
    const response = await request(app).get("/api/profile/admin");
    expect(response.body.username).toBe("admin");
  });
});
