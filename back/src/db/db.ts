import mongoose from "mongoose";

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || "");
    console.log(`Mongo connetion successfully 🚀🚀🚀`);
  } catch (err) {
    process.exit(1);
    return new Error(`Error connecting to db`);
  }
};
