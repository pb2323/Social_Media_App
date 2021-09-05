const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://mini-instagram-india.herokuapp.com";

module.exports = baseUrl;
