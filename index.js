require("dotenv").config();
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const credentials = require("./Middlewares/Credentials");
const userRoute = require("./Routes/userRoute");
const categoryRoute = require("./Routes/categoryRoute");
const postsRoutes = require("./Routes/postsRoutes");
const favRoutes = require("./Routes/favRoutes");
const commentsRoutes = require("./Routes/commentsRoutes");
const cookieParser = require("cookie-parser");
const limiter = require("./Middlewares/rateLimiter");
const hpp = require("hpp");
const app = express();
const { NotFound, errorHandler } = require("./Middlewares/errorHandler");
const port = process.env.PORT || 5000;

app.use(credentials);
app.use(cors(corsOptions));

// request size limit.
// app.use((req, res, next) => {
//   const requestSize = req.headers["content-length"];
//   const maxReqSize = 1024 * 1024 * 1.2;
//   if (requestSize > maxReqSize) {
//     return res
//       .status(413)
//       .json({ message: `Request Entity Too Large maxReqSize = 1.2Mb` });
//   }
//   console.log("Request size:", req.headers["content-length"]);
//   next();
// });
// request size limit.
// app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
// app.use("/", limiter);
// app.use(hpp());
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/posts", postsRoutes);
app.use("/favorites", favRoutes);
app.use("/comments", commentsRoutes);
app.get("/", (req, res) => res.send("Hello World!"));
// Error Handling Middleware
app.use(NotFound);
app.use(errorHandler);

app.listen(port, () => console.log(`app listening on port ${port}!`));
