import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
//dotenv created so that env variables can be loaded for every element
dotenv.config({
  path: "./env",
});
//connection with database
connectDB()
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port 8000");
    })
  )
  .catch((err) => console.log("mongodb connection has failed"));
