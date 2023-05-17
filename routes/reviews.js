const express = require('express')
const router = express.Router({mergeParams: true}); //so that we have access to parameter occasion_id
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const Occasion = require('../models/occasions');
const Review = require('../models/review');
const {occasionSchema, reviewSchema} = require('../schemas.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;