const {
  createPost,
  updatePost,
  getAllPosts,
  getPost,
} = require("../../Controllers/postsController");
const pool = require("../../config/connectDb");
describe.skip("testing create post function", () => {
  afterAll(async () => {
    await pool.end();
  });
  test("should send title, content, categoryId and optionally sending image", async () => {
    const request = {
      user: {
        _id: "b7e79688-619b-4aa3-a8f3-5abf45dcf3a2",
        username: "kareem",
        email: "kareem@outlook.com",
      },
      body: {
        title: "title",
        content: "content",
        categoryId: "893c63e0-b50d-4989-a5e4-b4654e64cdb9",
      },
    };
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await createPost(request, response);
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      _id: expect.any(String),
      userId: request.user._id,
      title: request.body.title,
      content: request.body.content,
      categoryId: request.body.categoryId,
    });
  });
  test("if user is not logged in it should return 401 unAuthorized", async () => {
    const request = {
      body: {
        title: "title",
        content: "content",
        categoryId: "893c63e0-b50d-4989-a5e4-b4654e64cdb9",
      },
    };
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await createPost(request, response);
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      message: "unAuthorized",
    });
  });
  test("if user doesn't send title or content it should return 400 bad request", async () => {
    const request = {
      user: {
        _id: "b7e79688-619b-4aa3-a8f3-5abf45dcf3a2",
        username: "kareem",
        email: "kareem@outlook.com",
      },
      body: {
        categoryId: "893c63e0-b50d-4989-a5e4-b4654e64cdb9",
      },
    };
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await createPost(request, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "title and content are required",
    });
  });
});
describe.skip("testing update post function", () => {
  afterAll(async () => {
    await pool.end();
  });
  const request = {
    user: {
      _id: "1f9009ac-1bc7-410d-9efe-54c5c334e883",
      username: "Abdullah",
      email: "Abdullah@gmail.com",
    },
    body: {
      title: "updated title",
      content: "updated content",
      categoryId: "893c63e0-b50d-4989-a5e4-b4654e64cdb9",
    },
    params: {
      id: "fff44475-cf40-4681-b2e6-13d086b740d3",
    },
  };
  const notValidRequestBody = {
    user: {
      _id: "1f9009ac-1bc7-410d-9efe-54c5c334e883",
      username: "Abdullah",
      email: "Abdullah@gmail.com",
    },
    body: {},
    params: {
      id: "fff44475-cf40-4681-b2e6-13d086b740d3",
    },
  };
  const notValidUserRequest = {
    user: {
      _id: "1f9", // wrong user id.
      username: "Abdullah",
      email: "Abdullah@gmail.com",
    },
    body: {
      title: "updated title",
      content: "updated content",
      categoryId: "893c63e0-b50d-4989-a5e4-b4654e64cdb9",
    },
    params: {
      id: "fff44475-cf40-4681-b2e6-13d086b740d3",
    },
  };
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  test("should send title or content or categoryId and optionally sending image and the user who create the post only can update it", async () => {
    await updatePost(request, response);
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      _id: request.params.id,
      userId: request.user._id,
      title: request.body.title,
      content: request.body.content,
      categoryId: request.body.categoryId,
      img_name: expect.any(String),
      img_url: expect.any(String),
      created_at: expect.any(Object),
      updatedAt: expect.any(Object),
    });
  });
  test("should return 401 if the user is not logged in or the user is not the creator of the post", async () => {
    await updatePost(notValidUserRequest, response);
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      message: "You don't have the right to update this post",
    });
  });
  test("user should send any value in request body to update or it should return 400 bad request", async () => {
    await updatePost(notValidRequestBody, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "Send at least one field to update",
    });
  });
});
describe.skip("testing get functions for posts", () => {
  afterAll(async () => {
    await pool.end();
  });
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const request = {};
  const getPostRequest = {
    params: {
      id: "fff44475-cf40-4681-b2e6-13d086b740d3",
    },
  };

  test("should return all posts", async () => {
    await getAllPosts(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          userId: expect.any(String),
          title: expect.any(String),
          content: expect.any(String),
          categoryId: expect.any(String),
          img_name: expect.any(String),
          img_url: expect.any(String),
          created_at: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      ])
    );
  });
  test("should return posts by Post id", async () => {
    await getPost(getPostRequest, response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      _id: getPostRequest.params.id,
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
});
