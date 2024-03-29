// 1 - Not Found.

function NotFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.sendStatus(404);
  next(error);
}
// 2 - Error Handler.

function errorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
  next();
}
module.exports = { NotFound, errorHandler };
