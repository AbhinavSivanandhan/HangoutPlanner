const express = require('express')
const router = express.Router();
const occasions = require('../controllers/occasions');
const catchAsync = require('../utils/catchAsync');
const Occasion = require('../models/occasions');
const {isLoggedIn, validateOccasion, isAuthor} = require('../middleware');


router.route('/')
   .get(catchAsync(occasions.index))
   .post(isLoggedIn, validateOccasion, catchAsync(occasions.createOccasion))

router.get('/new', isLoggedIn, occasions.renderNewForm)

router.route('/:id')
   .get(isLoggedIn, catchAsync(occasions.showOccasion))
   .put(isLoggedIn, isAuthor,  validateOccasion, catchAsync(occasions.updateOccasion))
   .delete(isLoggedIn, isAuthor, catchAsync(occasions.deleteOccasion))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(occasions.renderEditForm))

module.exports = router;