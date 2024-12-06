import { body, validationResult } from "express-validator";

const validateSignup = [
  body('name').trim().notEmpty().withMessage('Please enter the name field !'),
  body("email").trim().notEmpty().withMessage("Please enter the email field !")
    .isEmail().withMessage("Please enter a valid email address !"),
  body("password").notEmpty().withMessage("Please enter the password field !")
    .isLength({ min: 7 }).withMessage("Password must be at least 7 characters long !")
    .matches(/\d/).withMessage("Password must contain at least one number !")
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one symbol (!@#$%^&*(),.?":{}|<>) !'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
  body("email").trim().normalizeEmail().notEmpty().withMessage("Please enter the email field !")
    .isEmail().withMessage("Please enter a valid email address !"),
  body("password").notEmpty().withMessage("Please enter the password field !"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default { validateSignup, validateLogin };
