const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//connect to database
connectDB();

//Routes file
const bootcamp = require("./routes/bootcamp");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/user");
const reviews = require("./routes/reviews");

const app = express();

//body-parser
app.use(express.json());

//cookie-parser
app.use(cookieParser());

//dev logging middlware
if (process.env.NODE_ENV == "devlopment") {
  app.use(morgan("dev"));
}

//File uploading
app.use(fileUpload());

//Sanitize data
app.use(mongoSanitize());

//set header security
app.use(helmet());

//Prevent xss attack
app.use(xss());

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 mins
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

//Prevent http param polution
app.use(hpp());

//Enable CORS
app.use(cors());

//set the static folder
app.use(express.static(path.join(__dirname, "public")));

//Mount routers
app.use("/api/v1/bootcamps", bootcamp);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//Handle Unhandle Rejection
process.on("unhandledRejection", (err, Promise) => {
  console.log(`Error:${err.message}`.red);
  //close server & exit process
  server.close(() => process.exit(1));
});
