const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.NODE_ENV === "production" ? process.env.MONGO_URI : 'mongodb://127.0.0.1:27017/practice', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("Mongodb connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = connectDb;
