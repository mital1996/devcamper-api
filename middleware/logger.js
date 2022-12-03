const logger = (req, res, next) => {
  console.log(
    `${req.method}${req.prolocol}://${req.get("host")}${req.originalUrl}`
  );
  next();
};

module.exports = logger;
