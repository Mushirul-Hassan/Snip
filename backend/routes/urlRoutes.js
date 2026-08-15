import express from 'express';
import { createUrl, getUrl, updateUrl } from '../controllers/urlControllers.js';
const router = express.Router();

// router.post("/user");
// router.get("/user/:id");
router.post("/create", createUrl);
router.get("/:nano_id", getUrl);
router.patch("/:id", updateUrl);
// router.get("/shortUrl");
export default router;