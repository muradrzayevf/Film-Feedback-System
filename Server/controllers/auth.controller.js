import User from "../models/user.schema.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../db_helpers/token.helper.js";
import { parse } from "dotenv";
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(
          Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN)
        ),
      })
      .status(201)
      .json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  }
  const user = await User.findOne({ username }).select("+password");
  const token = generateToken(user._id);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(
        Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN)
      ), // 7 days
    })
    .status(200)
    .json({ message: "Login successful", userId: user._id });
};
export const logoutUser = (req, res) => {
  res.status(200).clearCookie("token").json({ message: "Logout successful" });
};
