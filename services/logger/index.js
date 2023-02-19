const logger = (message = "", data = {}) => {
  if (process.env.NODE_ENV !== "PRODUCTION")
    console.log(`\n\n${message}\n\n`, data);
};

module.exports = logger;
