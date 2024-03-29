const {
  getCategoryById,
  getCategoryByName,
} = require("../../lib/categoryFunctions");
const { getPostById } = require("../../lib/postsFunctions");
const pool = require("../../config/connectDb");
describe.skip("testing category functions", () => {
  afterAll(async () => {
    await pool.end();
  });
  test("you should send the id and it should return the category", async () => {
    const categoryId = "893c63e0-b50d-4989-a5e4-b4654e64cdb9";
    const response = await getCategoryById(categoryId);
    expect(response).toEqual({
      _id: categoryId,
      name: expect.any(String),
      creator: expect.any(String),
      created_at: expect.any(Object),
      updatedAt: expect.any(Object),
    });
  });
  test("it should return null if the category is not found", async () => {
    const categoryId = "8";
    const response = await getCategoryById(categoryId);
    expect(response).toEqual(null);
  });
  test("you should send the category name and it should return the category", async () => {
    const categoryName = "Test";
    const response = await getCategoryByName(categoryName);
    expect(response).toEqual({
      _id: expect.any(String),
      name: categoryName,
      creator: expect.any(String),
      created_at: expect.any(Object),
      updatedAt: expect.any(Object),
    });
  });
  test("it will return null if the category is not found", async () => {
    const categoryName = "anyString";
    const response = await getCategoryByName(categoryName);
    expect(response).toBe(null);
  });
});
describe.skip("test post functions", () => {
  afterAll(async () => {
    await pool.end();
  });
  test("you should send the id and it should return the post object", async () => {
    const postId = "fff44475-cf40-4681-b2e6-13d086b740d3";
    const response = await getPostById(postId);
    expect(response).toEqual({
      _id: postId,
      userId: expect.any(String),
      img_name: expect.any(String),
      img_url: expect.any(String),
      title: expect.any(String),
      content: expect.any(String),
      categoryId: expect.any(String),
      created_at: expect.any(Object),
      updatedAt: expect.any(Object),
    });
  });
  test("it should return null if the post is not found", async () => {
    const categoryId = "8";
    const response = await getCategoryById(categoryId);
    expect(response).toEqual(null);
  });
});
