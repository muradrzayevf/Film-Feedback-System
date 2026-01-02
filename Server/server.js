import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./db_helpers/db.helper.js";
import APIrouter from "./routers/index.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use("/api", APIrouter);
connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
