process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const Item = require("../item");

let jsonString = `[{"name":"cheerios","price":1.99},{"name":"popsicle","price":0.99},{"name":"corn","price":1.25},{"name":"cat treats","price":199.99}]`;
let item = Item.getAll()[0];
console.log(item);

beforeEach(async () => {
  let parsedJson = JSON.parse(jsonString);
  Item.updateDb(parsedJson);
});

afterEach(async () => {
  let parsedJson = JSON.parse(jsonString);
  Item.updateDb(parsedJson);
});

describe("GET /items", function () {
  test("Fetch a list of all items", async function () {
    const response = await request(app).get("/items");
    const { items } = response.body;
    expect(response.statusCode).toBe(200);
    expect(items).toHaveLength(4);
  });
});

describe("GET /items/:name", function () {
  test("Gets a single item", async function () {
    const response = await request(app).get(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.item).toEqual(item);
    expect(response.body.item.name).toEqual("cheerios");
  });

  test("Responds with 404 if can't find item", async function () {
    const response = await request(app).get("/items/tuna");
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toEqual("Item not found");
  });
});

describe("POST /items", function () {
  test("Creates a new item", async function () {
    const response = await request(app).post("/items").send({
      name: "carrots",
      price: 0.75,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.added).toHaveProperty("name");
    expect(response.body.added).toHaveProperty("price");
    expect(response.body.added.name).toEqual("carrots");
    expect(response.body.added.price).toEqual(0.75);
  });

  test("Checks that total item count is updated", async function () {
    const response = await request(app).get("/items");
    const { items } = response.body;
    expect(items).toHaveLength(5);
  });
});

describe("PATCH /items/:name", function () {
  test("Updates single item in query params", async function () {
    const response = await request(app).patch(`/items/${item.name}`).send({
      name: "Test",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.updated).toEqual({
      name: "Test",
      price: item.price
    });
  });

  test("Responds with 404 if can't find item", async function () {
    const response = await request(app).patch("/items/tuna");
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toEqual("Item not found");

    console.log(response.body)
  });
});

describe("DELETE /items/:name", function () {
    test("Deletes a single a item", async function () {
      const response = await request(app)
        .delete(`/items/${item.name}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: "Deleted" });
    });

    test("Checks that total item count is updated", async function () {
        const response = await request(app).get("/items");
        const { items } = response.body;
        expect(items).toHaveLength(4);
      });

      test("Checks that deleted item is no longer in array of all items", async function () {
        const response = await request(app).get(`/items/${item.name}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toEqual("Item not found");
      });
  });