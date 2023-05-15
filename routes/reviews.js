const express = require('express')
const router = express.Router({mergeParams: true}); //so that we have access to parameter occasion_id
const catchAsync = require('../utils/catchAsync');
const Occasion = require('../models/occasions');
const Review = require('../models/review');
const {occasionSchema, reviewSchema} = require('../schemas.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
   const occasion = await Occasion.findById(req.params.id);
   const review = new Review(req.body.review);
   review.author = req.user._id;
   occasion.reviews.push(review);
   await review.save();
   await occasion.save();
   req.flash('success', 'Successfully created new review');
   res.redirect(`/occasions/${occasion._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor,catchAsync(async (req, res) => {
   const { id, reviewId } = req.params;
   await Occasion.findByIdAndUpdate(id, {  $pull: { reviews: reviewId } });
      //update reference to review objectid. $pull removes one or all occurences of a value in array
   await Review.findByIdAndDelete(req.params.reviewId); //delete review
   req.flash('success', 'Successfully deleted the review');

   res.redirect(`/occasions/${id}`);
}))

module.exports = router;