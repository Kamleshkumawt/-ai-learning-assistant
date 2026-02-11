import { Router } from "express";
import { getDashboard } from "../controllers/progress.controller.js";
import protect from "../middleware/auth.js";

const router = Router();

//All routes are protected
router.use(protect);

router.get("/dashboard", getDashboard);

export default router;
