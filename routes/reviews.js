const express = require('express')
const router = express.Router({mergeParams: true}); //so that we have access to parameter occasion_id
const catchAsync = require('../utils/catchAsync');
const Occasion = require('../models/occasions');
const Review = require('../models/review');
const {occasionSchema, reviewSchema} = require('../schemas.js');

const validateReview = (req, res, next) => {
   const { error } = reviewSchema.validate(req.body);
   //console.log(result);
   if(error){
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
   }
   else{
   next();
   }
}


router.post('/', validateReview, catchAsync(async (req, res) => {
   const occasion = await Occasion.findById(req.params.id);
   const review = new Review(req.body.review);
   console.log(req.body);
   console.log(review);
   occasion.reviews.push(review);
   await review.save();
   await occasion.save();
   req.flash('success', 'Successfully created new review');
   res.redirect(`/occasions/${occasion._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
   const { id, reviewId } = req.params;
   await Occasion.findByIdAndUpdate(id, {  $pull: { reviews: reviewId } });
      //update reference to review objectid. $pull removes one or all occurences of a value in array
   await Review.findByIdAndDelete(req.params.reviewId); //delete review
   req.flash('success', 'Successfully deleted the review');

   res.redirect(`/occasions/${id}`);
}))

module.exports = router;