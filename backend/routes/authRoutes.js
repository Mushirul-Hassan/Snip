import express from "express";
import { register, login, refresh, logout } from "../controllers/authControllers.js";
const router = express.Router();

router.post("/sign-up", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
export default router;
