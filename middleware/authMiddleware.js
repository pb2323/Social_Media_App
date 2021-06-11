const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) return res.status(401).send("Unauthorized");
    const { userId } = await jwt.verify(
      req.headers.authorization,
      process.env.jwtSecret
    );
    req.userId = userId;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("Unauthorized");
  }
};
