import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 3 * 60 * 60,
  });
};

export default generateToken;