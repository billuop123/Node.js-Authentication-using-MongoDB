import AppError from "../utils/AppError.js";

// Handle invalid ID errors (CastError)
const handleCastErrorDB = (err) => {
  const message = `The id ${err.value} is invalid`;
  return new AppError(message, 400);
};

// Handle duplicate field errors (MongoDB duplicate key)
const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `The name field should be unique; ${value} is not unique. Try again!`;
  return new AppError(message, 400);
};

// Handle JWT errors (JsonWebTokenError)
const handleWebTokenError = (err) => {
  const message = "The token value is incorrect; please try again!";
  return new AppError(message, 400);
};

// Handle validation errors (ValidationError)
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `The errors are: ${errors.join(", ")}`;
  return new AppError(message, 400);
};

// Handle expired token errors
const handleExpiredError = () =>
  new AppError("Your token has expired; please log in again!", 401);

// Send error response in development mode
const sendErrDev = (err, res, req) => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      stack: err.stack,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).render("error", {
      title: "Login error",
      msg: err.message,
    });
  }
};

// Send error response in production mode
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error("ERROR 💥", err); // Log unexpected errors
    return res.status(err.statusCode).render("error", {
      title: "Login error",
      msg: "Please try again later",
    });
  }

  if (err.isOperational) {
    console.log(err.message);
    return res.status(err.statusCode).render("error", {
      title: "Login error",
      msg: err.message,
    });
  }

  return res.status(err.statusCode).render("error", {
    title: "Login error",
    msg: "Please try again later",
  });
};

// Main error handling middleware
export default (err, req, res, next) => {
  // Set default status and message
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res, req);
  } else if (process.env.NODE_ENV === "production") {
    let error = {
      name: err.name,
      path: err.path,
      value: err.value,
      message: err.message,
      code: err.code,
      errors: err.errors,
      statusCode: err.statusCode,
    };

    console.log(error); // Log error details

    // Handle specific error types
    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    } else if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    } else if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    } else if (error.name === "JsonWebTokenError") {
      error = handleWebTokenError(error);
    } else if (error.name === "TokenExpiredError") {
      error = handleExpiredError(error);
    }

    sendErrorProd(error, req, res);
  }
};
