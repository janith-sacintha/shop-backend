import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
  {
    product: { type: String , ref: "Product", required: true },
    user: { type: String, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
)

const Review = mongoose.model("reviews", reviewSchema)

export default Review;
