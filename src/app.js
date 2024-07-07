import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

//middleware to handle frontend connection by the help of cors
app.use(cors({ origin: process.env.CORS_ORGIN, credentials: true }));
// middleware to handle cookies access the cookies and manipulate the cookies
app.use(cookieParser());
//middleware to send json to body
app.use(express.json({ limit: "16kb" }));
//middleware to send form data from url for example login form or anything extended means nested objects
app.use(express.urlencoded({ extended: false, limit: "16kb" }));
//middleware for storing asserts like files pdfs images assest
app.use(express.static("public"));

export { app };
