import express from "express";
import authRouter from "./auth.router.js";
import filmrouter from "./film.router.js";
const router = express.Router();
router.use("/auth", authRouter);
router.use("/films", filmrouter);
export default router;
