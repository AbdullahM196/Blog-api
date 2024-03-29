const {
  register,
  login,
  logout,
  profile,
  editProfile,
} = require("../../Controllers/userController");
const pool = require("../../config/connectDb");

describe.skip("testing user Register function", () => {
  afterAll(async () => {
    await pool.end();
  });
  const request = {
    body: {
      username: "kareem",
      email: "kareem@outlook.com",
      password: "12345678",
    },
  };
  const requestWithInvalidEmail = {
    body: {
      username: "Ali",
      email: "Ali.outlook.com", // not valid email format.
      password: "12345678",
    },
  };
  const requestWithInvalidPassword = {
    body: {
      username: "Ali",
      email: "Ali@outlook.com",
      password: "1234567", // less than 8 characters.
    },
  };
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn(),
  };
  test.skip("Register user should return 201 and user object ,_id, username, email", async () => {
    await register(request, response);
    console.log(request, response);
    expect(response.status).toHaveBeenCalledWith(201);
    const cookieMock = response.cookie.mock.lastCall;
    const cookieValue = cookieMock[0] + cookieMock[1];
    expect(cookieValue).toContain("blogJWT", expect.any(String));
    expect(response.json).toHaveBeenCalledWith({
      _id: expect.any(String),
      username: request.body.username,
      email: request.body.email,
    });
  });
  test.skip("it will return 409 if user already exists if username or email already exists", async () => {
    await register(request, response);
    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith({
      message: "User already exists",
    });
  });
  test.skip("it will return 400 if email is not valid", async () => {
    await register(requestWithInvalidEmail, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "Please add valid email",
    });
  });
  test.skip("it will return 400 if password is less than 8 characters", async () => {
    await register(requestWithInvalidPassword, response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: "Password Have to be at least 8 characters",
    });
  });
});
describe.skip("testing user login function", () => {
  afterAll(async () => {
    await pool.end();
  });
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn(),
  };
  const request = {
    body: {
      email: "kareem@outlook.com",
      password: "12345678",
    },
  };
  const requestWithWrongEmail = {
    body: {
      email: "Ali123@outlook.com", // not Found email.
      password: "12345678",
    },
  };
  const requestWithWrongPassword = {
    body: {
      email: "Ali@outlook.com",
      password: "wrongPassword",
    },
  };
  test.skip("in successful login it should return the user object with _id, username, email and set res.cookie=token", async () => {
    await login(request, response);
    const cookieMock = response.cookie.mock.lastCall;
    const cookieValue = cookieMock[0] + cookieMock[1];
    expect(response.status).toHaveBeenCalledWith(201);
    expect(cookieValue).toContain("blogJWT", expect.any(String));
    expect(response.json).toHaveBeenCalledWith({
      _id: expect.any(String),
      username: expect.any(String),
      email: expect.any(String),
    });
  });
  test.skip("if the email is not found it should return 404 and message Invalid Credentials", async () => {
    await login(requestWithWrongEmail, response);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      message: "Invalid Credentials",
    });
  });
  test("if the Password is not found it should return 404 and message Invalid Credentials", async () => {
    await login(requestWithWrongPassword, response);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      message: "Invalid Credentials",
    });
  });
});
describe.skip("testing user logout function", () => {
  afterAll(async () => {
    await pool.end();
  });
  const response = {
    sendStatus: jest.fn().mockReturnThis(),

    clearCookie: jest.fn(),
  };
  const request = {
    user: {
      _id: "1",
      username: "kareem",
      email: "kareem@outlook.com",
    },
    cookies: {
      blogJWT: "<KEY>",
    },
  };

  test("it should return 204 and clear the cookie", async () => {
    await logout(request, response);
    expect(response.sendStatus).toHaveBeenCalledWith(204);
    expect(response.clearCookie).toHaveBeenCalledWith("blogJWT");
  });
});

describe.skip("testing get user profile", () => {
  afterAll(async () => {
    await pool.end();
  });
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn(),
  };
  const request = {
    // if user is logged in it should store the user object in req.user in backend.
    user: {
      _id: "1",
      username: "kareem",
      email: "kareem@outlook.com",
    },
  };
  const unAuthenticatedRequest = {
    // if the user is not logged in it should return 401 unAuthorized.
    // and there will not be any user object in req.user in backend.
  };
  test.skip("if the user is logged in it should return the user Object without sending any information from frontend ", async () => {
    await profile(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ user: request.user });
  });
  test("if the user is not logged in it will return 401 unAuthorized.", async () => {
    await profile(unAuthenticatedRequest, response);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      message: "Unauthorized",
    });
  });
});
describe.skip("testing edit user profile", () => {
  afterAll(async () => {
    await pool.end();
  });
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn(),
  };
  const request = {
    // if user is logged in it should store the user object in req.user in backend.
    user: {
      _id: "1",
      username: "kareem",
      email: "kareem@outlook.com",
    },
    body: {
      username: "kareem123",
      email: "kareem123@outlook.com",
    },
  };
  const invalidRequest = {
    body: {
      username: "kareem123",
      email: "kareem123@outlook.com",
    },
  };
  test("user should send user name or email or image to edit profile and return status 201", async () => {
    await editProfile(request, response);
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      _id: expect.any(String),
      username: request.body.username,
      email: request.body.email,
    });
  });
  test("should return 401 if user is not logged in", async () => {
    await editProfile(invalidRequest, response);
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      message: "Unauthorized",
    });
  });
});
