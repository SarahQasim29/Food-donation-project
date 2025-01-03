const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const db =
      "mongodb+srv://sarahqasim024740:NXmyQ474OVnCigiL@cluster0.ldd2c.mongodb.net/";
    await mongoose.connect(db);
    console.log("MongoDB connected...");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
