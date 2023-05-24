const express = require('express')
const router = express.Router();
const occasions = require('../controllers/occasions');
const catchAsync = require('../utils/catchAsync');
const Occasion = require('../models/occasions');
const {isLoggedIn, validateOccasion, isAuthor} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });//multer({ dest: 'uploads/'});


router.route('/')
   .get(catchAsync(occasions.index))
   .post(isLoggedIn, upload.array('image'), validateOccasion, catchAsync(occasions.createOccasion))
   // .post(upload.array('image'), (req, res) => {
   //    console.log(req.body, req.files);
   //    res.send('it works!')
   // }) 
  // .post(isLoggedIn, validateOccasion, catchAsync(occasions.createOccasion))

router.get('/new', isLoggedIn, occasions.renderNewForm)

router.route('/:id')
   .get(isLoggedIn, catchAsync(occasions.showOccasion))
   .put(isLoggedIn, isAuthor, upload.array('image'), validateOccasion, catchAsync(occasions.updateOccasion))
   .delete(isLoggedIn, isAuthor, catchAsync(occasions.deleteOccasion))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(occasions.renderEditForm))

module.exports = router;