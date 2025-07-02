import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || "");
    console.log(`Mongo connetion successfully 🚀🚀🚀`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
