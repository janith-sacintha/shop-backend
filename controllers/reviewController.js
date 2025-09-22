import WebsiteReview from "../models/review.js";

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await WebsiteReview.find()
      .populate("user", "firstName lastName image")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const addReview = async (req, res) => {
  try {
    const { text, rating } = req.body;
    if (!text || !rating) return res.status(400).json({ message: "Text and rating required" });

    const newReview = new WebsiteReview({
      text,
      rating,
      user: req.user.id, 
    });

    await newReview.save();
    await newReview.populate("user", "firstName lastName image");

    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add review" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { text, rating } = req.body;
    const review = await WebsiteReview.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Forbidden: Cannot edit others' reviews" });

    review.text = text || review.text;
    review.rating = rating || review.rating;

    await review.save();
    await review.populate("user", "firstName lastName image");

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update review" });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const review = await WebsiteReview.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (!req.user || review.user.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Forbidden: Cannot delete others' reviews" });

    await WebsiteReview.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ message: "Failed to delete review" });
  }
};
