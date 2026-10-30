import express from "express";
import { register, login, refresh } from "../controllers/authControllers.js";
const router = express.Router();

router.post("/sign-up", register);
router.post("/login", login);
router.post("/refresh", refresh);
export default router;
