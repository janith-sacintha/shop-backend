import Review from "../models/review.js"

// @desc    Create a review for a product
// @route   POST /api/reviews/:productId
// @access  Public (no auth)
export const createReview = async (req, res) => {

    if(req.user === null){
            res.status(403).json({message : "Loging first"})
            return;
    }
    
  try {
    const { text } = req.body
    const user = req.user.firstName
    const product = req.params.productId

    if (!text || !user) {
      return res.status(400).json({ message: "User and text are required" })
    }

    const review = new Review({
      product,
      user,
      text,
    })

    await review.save()
    res.status(201).json(review)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to add review" })
  }
}

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const product = req.params.productId
    const reviews = await Review.find({ product }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch reviews" })
  }
}
