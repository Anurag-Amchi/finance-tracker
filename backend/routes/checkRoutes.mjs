import express from 'express';
import checkLimit from "../controllers/checkControllers.mjs";
    
const router = express.Router();

router.route("/").post(checkLimit);
export default router;