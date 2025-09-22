import mongoose from "mongoose";

const websiteReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const WebsiteReview = mongoose.model("websiteReviews", websiteReviewSchema);
export default WebsiteReview;
