import express from "express";
import { register, login } from "../controllers/authControllers.js";
import { refresh } from "../controllers/authControllers.js";
const router = express.Router();

router.post("/sign-up", register);
router.post("/login", login);
router.get("/refresh", refresh);
export default router;
