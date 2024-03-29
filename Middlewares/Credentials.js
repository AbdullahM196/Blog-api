const allowedOrigins = process.env.allowedOrigins.split(",");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE,OPTIONS,PATCH"
    );
    res.setHeader("Content-Type", "application/json");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  } else {
    next();
  }
};

module.exports = credentials;
