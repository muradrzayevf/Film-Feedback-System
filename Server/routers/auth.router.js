import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check", verifyToken, (req, res) => {
  res
    .status(200)
    .json({ message: "You have accessed a protected route", data: req.user });
});
export default router;
