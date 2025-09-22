import express from "express";
import { addReview, deleteReview, getAllReviews, updateReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();


reviewRouter.get("/", getAllReviews);
reviewRouter.post("/", addReview);
reviewRouter.put("/:id", updateReview);
reviewRouter.delete("/:id", deleteReview);

export default reviewRouter;
