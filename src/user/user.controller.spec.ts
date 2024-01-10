import request from "supertest";
const app = "http://localhost:3000";
describe("User create 테스트", () => {
  beforeEach(async () => {
    await request(app).delete("/users").send({ email: "test1@example.com" });
    await request(app).delete("/users").send({ email: "test2@example.com" });
  });

  it("email 중복 확인", async () => {
    await request(app)
      .post("/users")
      .send({
        email: "test1@example.com",
        username: "testuser",
        password: "Ex@mp1e!!",
      })
      .expect(201);

    const res = await request(app)
      .post("/users")
      .send({
        email: "test1@example.com",
        username: "abcd",
        password: "Ex@mp1e!!",
      })
      .expect(400);
    expect(res.body.error).toBe("Email is already exist");
  });

  it("username 중복 확인", async () => {
    await request(app)
      .post("/users")
      .send({
        email: "test2@example.com",
        username: "testuser",
        password: "Ex@mp1e!!",
      })
      .expect(201);

    const res = await request(app)
      .post("/users")
      .send({
        email: "test1@example.com",
        username: "testuser",
        password: "Ex@mp1e!!",
      })
      .expect(400);
    expect(res.body.error).toBe("UserName is already exist");
  });
});