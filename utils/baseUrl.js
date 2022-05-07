const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : process.env.HOST_NAME;

module.exports = baseUrl;
