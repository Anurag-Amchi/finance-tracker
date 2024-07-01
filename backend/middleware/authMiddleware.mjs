import jwt from "jsonwebtoken";
import asyncHandler from"express-async-handler";
import dotenv from 'dotenv';
dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      req.user = data.id;
      next();
    } catch (error) {
      res.status(400).json({ err: "Unauthorized Access" });
    }
  } else {
    res.status(400).json({ err: "Unauthorized Access" });
  }
});

export default protect;