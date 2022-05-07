const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://network-in.herokuapp.com";

module.exports = baseUrl;
