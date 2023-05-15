const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Occasion = require('../models/occasions');
const {isLoggedIn, validateOccasion, isAuthor} = require('../middleware');

router.get('/', catchAsync(async (req, res) => {
   const occasions = await Occasion.find({});
   res.render('occasions/index',{ occasions });
}))

router.get('/new', isLoggedIn, async (req, res) => {
   const occasions = await Occasion.find({});
   res.render('occasions/new');
})

router.post('/', isLoggedIn, validateOccasion, catchAsync(async (req, res, next) => {
   const occasion = new Occasion(req.body.occasion);
   occasion.author = req.user._id;
   await occasion.save();
   req.flash('success', 'Successfully made a new event');
   res.redirect(`/occasions/${occasion._id}`);
}))

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
   const occasion = await Occasion.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
         path: 'author'
      }
   }).populate('author');
   console.log(occasion);
   if(!occasion){
      req.flash('error', 'Cannot find that event!')
      res.redirect('/occasions');
   }
   res.render('occasions/show', { occasion }); //.populate expands the id in reviews to full object
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
   const { id } = req.params;
   const occasion = await Occasion.findById(id);
   if(!occasion){
      req.flash('error', 'Cannot find that event!')
      res.redirect('/occasions');
   }
   res.render('occasions/edit', { occasion });
}))

router.put('/:id', isLoggedIn, isAuthor,  validateOccasion, catchAsync(async (req, res) => {
   const { id } = req.params;
   const occasion = await Occasion.findByIdAndUpdate(id, {...req.body.occasion}); //change this later to just use previously found id to update. reduces cost
   req.flash('success', 'Successfully updated the event');
   res.redirect(`/occasions/${occasion._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
   const { id } = req.params;
   await Occasion.findByIdAndDelete(id);
   res.redirect('/occasions');
}))

module.exports = router;