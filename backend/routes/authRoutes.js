import express from "express";
import { register, login } from "../controllers/authControllers.js";
import { refresh } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/sign-up", register);
router.post("/login", login);
router.post("/refresh", refresh);
export default router;
