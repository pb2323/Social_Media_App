const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://642d-103-136-89-0.in.ngrok.io";

module.exports = baseUrl;
