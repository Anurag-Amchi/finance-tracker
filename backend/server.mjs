import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import connectDB from './config/db.mjs';

const app = express();
const PORT = 5000;

connectDB();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

import userRoutes from './routes/userRoutes.mjs'
import txnRoutes from './routes/txnRoutes.mjs'
import checkRoutes from './routes/checkRoutes.mjs'
app.use("/user", userRoutes);
app.use("/txns", txnRoutes);
app.use("/check",checkRoutes);

app.get('/logout', (req, res) => {
  res.redirect('/auth');
  res.clearCookie('jwt');
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`)
});