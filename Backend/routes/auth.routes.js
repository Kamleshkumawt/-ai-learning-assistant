import { Router } from "express";
import { body } from "express-validator";
import { changePassword, getProfile, login, register, updateProfile } from "../controllers/auth.controller.js";
import protect from '../middleware/auth.js';

const router = Router();

// validation middleware

const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please Provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please Provide a valid email"),
  body("password").isEmpty().withMessage("Password is required"),
];

//public routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

//Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/change-password", protect, changePassword);

export default router;
