import express from 'express';
const router = express.Router();

router.post("/user");
router.post("/url");
router.get("/url/:id");
router.get("/user/:id");
router.get("/shortUrl");