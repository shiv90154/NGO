const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:");
    console.error(error.message);
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    process.exit(1);
  }
};

module.exports = connectDB;
