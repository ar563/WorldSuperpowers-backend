const request = require("supertest");

const app = require("../app");
const token = require("../private").token;

describe("Test the upload_avatar path", () => {
  test("It should response the POST method without file and authorization", async () => {
    const response = await request(app).post("/api/upload_avatar");
    expect(response.statusCode).toBe(403);
  });

  test("It should response the POST method with file and without authorization", async () => {
    const response = await request(app)
      .post("/api/upload_avatar")
      .attach("file", "./public/images/blank.png");
    expect(response.statusCode).toBe(403);
  });

  test("It should response the POST method with file and authorization", async () => {
    const response = await request(app)
      .post("/api/upload_avatar")
      .set("Authorization", token)
      .attach("file", "./public/images/blank.png");
    expect(response.statusCode).toBe(200);
  });
});
