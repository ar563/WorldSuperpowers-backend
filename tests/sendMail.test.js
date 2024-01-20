const sendMail = require("../utils/sendMail");

describe("Test the sendMail util", () => {
  test("It should accept email", async () => {
    const response = await sendMail({
      to: "qh5ff7+92gjnt07vrh08@sharklasers.com",
      subject: "test",
      html: "<h1>test</h1>",
    });
    expect(response.accepted[0]).toBe("qh5ff7+92gjnt07vrh08@sharklasers.com");
  }, 20000);
});
