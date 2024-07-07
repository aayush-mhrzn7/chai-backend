import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
const app = express();
//dotenv created so that env variables can be loaded for every element
dotenv.config({
  path: "./env",
});
connectDB();

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 8000");
});
