import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("mongodb connected Sucessfully");
    console.log(
      `connection Instance host is ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("error when connection with mongo db");
    process.exit(1);
  }
};
export default connectDB;
