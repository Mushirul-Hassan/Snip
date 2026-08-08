import express from 'express';
import { createUrl, getUrl } from '../controllers/urlControllers';
const router = express.Router();

// router.post("/user");
// router.get("/user/:id");
router.post("/url", createUrl);
router.get("/url/:id", getUrl);
// router.get("/shortUrl");