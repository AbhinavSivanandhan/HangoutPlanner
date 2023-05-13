const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Occasion = require('../models/occasions');
const {occasionSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware');

const validateOccasion = (req, res, next) => {
   const { error } = occasionSchema.validate(req.body);
   //console.log(result);
   if(error){
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
   }
   else{
   next();
   }
}

router.get('/', catchAsync(async (req, res) => {
   const occasions = await Occasion.find({});
   res.render('occasions/index',{ occasions });
}))

router.get('/new', isLoggedIn, async (req, res) => {
   const occasions = await Occasion.find({});
   res.render('occasions/new');
})

router.post('/', isLoggedIn, validateOccasion, catchAsync(async (req, res, next) => {
//if(!req.body.occasion) throw new ExpressError('Invalid Occasion Data', 400);
   const occasion = new Occasion(req.body.occasion);
   occasion.author = req.user._id;
   await occasion.save();
   req.flash('success', 'Successfully made a new event');
   res.redirect(`/occasions/${occasion._id}`);
}))

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
   const occasion = await Occasion.findById(req.params.id).populate('reviews').populate('author');
   console.log(occasion);
   if(!occasion){
      req.flash('error', 'Cannot find that event!')
      res.redirect('/occasions');
   }
   res.render('occasions/show', { occasion }); //.populate expands the id in reviews to full object
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
   const occasion = await Occasion.findById(req.params.id);
   if(!occasion){
      req.flash('error', 'Cannot find that event!')
      res.redirect('/occasions');
   }
   res.render('occasions/edit', { occasion });
}))

router.put('/:id', isLoggedIn, validateOccasion, catchAsync(async (req, res) => {
   const { id } = req.params;
   const occasion = await Occasion.findByIdAndUpdate(id, {...req.body.occasion});
   req.flash('success', 'Successfully updated the event');
   res.redirect(`/occasions/${occasion._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
   const { id } = req.params;
   await Occasion.findByIdAndDelete(id);
   res.redirect('/occasions');
}))

module.exports = router;