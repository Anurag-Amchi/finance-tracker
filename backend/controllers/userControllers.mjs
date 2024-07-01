import asyncHandler from "express-async-handler";
import User from "../models/userModel.mjs";
import generateToken from "../config/generateToken.mjs";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
    try{
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ err :"User already exists." });
    }

    const user = await User.create({ name, email, password });
    if (user) {
      const token = generateToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: 'none', maxAge : 3 * 60 * 60 * 1000});
      res.status(201).json({
        name: user.name,
        email: user.email,
      });
    }
  }
  catch(error){
    res.status(400).json({ err :"Unable to signup at this moment." });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ err :"User does not exist."});
  }
  else if (await user.matchPassword(password) == true) {
    const token = generateToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge : 3 * 60 * 60 * 1000});
    res.status(201).json({
      name: user.name,
      email: user.email,
    });
  } 
  else if (await user.matchPassword(password) == false) {
    res.status(400).json({ err :"Invalid Credentials"});
  }
  else{
    res.status(400).json({ err :"Unable to login at this moment."});
  }
});

const setLimit = asyncHandler(async (req, res) => {
    try{
        await User.findOneAndUpdate({ _id: req.user }, req.body);
        res.status(200).json({ limit: "User limit updated successfully" });
    } catch (error) { res.status(400).json({ err: "Server Error" }); }
});

const getLimit = asyncHandler(async (req, res) => {
  try{
    const user = await User.findOne({ _id: req.user });
    res.status(200).json({ limit: user.limit });
  } catch (error) { res.status(400).json({ err: "Server Error" }); }
});

export default { registerUser, authUser, setLimit, getLimit };