import express from 'express';
import { createUrl, getUrl, updateUrl, deleteUrl } from '../controllers/urlControllers.js';
const router = express.Router();

// router.post("/user");
// router.get("/user/:id");
router.post("/create", createUrl);
router.get("/:nano_id", getUrl);
router.patch("/:nano_id", updateUrl);
router.delete("/:nano_id", deleteUrl);
// router.get("/shortUrl");
export default router;