import asyncHandler from "express-async-handler";
import { sendEmailExceed, sendEmailClose } from "../config/mailto.mjs";

const border = 0.9;  // ranges close to limit = (90% to 100% of limit)

const checkLimit = asyncHandler(async (req, res) => {
    const { limit, totalExpenses, email } = req.body;
    try{
        if(totalExpenses <= border*limit){
            res.status(202).json({ message: "Within Limit !" });
        }
        else if(border*limit < totalExpenses && totalExpenses <= limit){
            sendEmailClose(email,totalExpenses,limit);
            res.status(201).json({ message: "Close to Limit !" });
        } 
        else{
            sendEmailExceed(email,totalExpenses,limit);
            res.status(201).json({ message: "Exceeded the Limit !" });
        }
    } catch (error) { res.status(400).json({ err: "Server Error" }); }
});

export default checkLimit;