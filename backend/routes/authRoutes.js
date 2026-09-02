import express from 'express';
import {createAccount  } from '../controllers/authControllers.js';
const router = express.Router();

router.post("/sign-up", createAccount);
export default router;