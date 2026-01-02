import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token from cookies:", token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT secret is not defined in environment variables");
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res
        .status(401)
        .json({ message: "Invalid token, authorization denied" });
    }
    req.user = { id: decoded.id };
    next();
  });
};
export default verifyToken;
export { verifyToken };
