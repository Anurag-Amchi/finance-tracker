import express from 'express';
import userRoutes from '../controllers/userControllers.mjs';
const { registerUser, authUser, setLimit, getLimit } = userRoutes;
import userValidators from "../middleware/validator.mjs";
const { validateSignup, validateLogin } = userValidators;
import protect from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.route("/signup").post(validateSignup, registerUser);
router.route('/login').post(validateLogin, authUser);
router.route("/setLimit").patch(protect,setLimit);
router.route("/getLimit").get(protect,getLimit);

export default router;