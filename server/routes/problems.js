import express from "express";
import { analysis, getAllProblem, getLikes, getSolved, getSpecificProblem, handleDislikes, handleLikes } from "../controllers/problems.js";
import authMiddleware from "../middlewares/auth.js";
const router = express.Router();

router.get("/all-problems",getAllProblem)
router.get("/:problemId",getSpecificProblem)
router.post("/like/:problemId",authMiddleware,handleLikes)
router.post("/dislike/:problemId",authMiddleware,handleDislikes)
router.get("/getLikes/:problemId",authMiddleware,getLikes)
router.get("/getSolved/:problemId",authMiddleware,getSolved)
router.post("/analyze",analysis)

export default router