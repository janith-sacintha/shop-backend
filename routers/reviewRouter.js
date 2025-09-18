
import express from "express"
import { createReview, getProductReviews } from "../controllers/reviewController.js"

const reviewRouter = express.Router()

reviewRouter.post("/:productId", createReview)
reviewRouter.get("/:productId", getProductReviews)

export default reviewRouter;
