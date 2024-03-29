const allowedOrigins = process.env.allowedOrigins.split(",");
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
module.exports = corsOptions;
