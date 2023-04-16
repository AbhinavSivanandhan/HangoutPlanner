const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Occasion = require('../models/occasions');
const {occasionSchema} = require('../schemas.js');

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

router.get('/new', async (req, res) => {
   const occasions = await Occasion.find({});
   res.render('occasions/new');
})

router.post('/', validateOccasion, catchAsync(async (req, res, next) => {
   //if(!req.body.occasion) throw new ExpressError('Invalid Occasion Data', 400);
   const occasion = new Occasion(req.body.occasion);
   await occasion.save();
   res.redirect(`/occasions/${occasion._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
   const occasion = await Occasion.findById(req.params.id).populate('reviews');
   res.render('occasions/show', { occasion }); //.populate expands the id in reviews to full object
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
   const occasion = await Occasion.findById(req.params.id);
   res.render('occasions/edit', { occasion });
}))

router.put('/:id', validateOccasion, catchAsync(async (req, res) => {
   const { id } = req.params;
   const occasion = await Occasion.findByIdAndUpdate(id, {...req.body.occasion});
   res.redirect(`/occasions/${occasion._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
   const { id } = req.params;
   await Occasion.findByIdAndDelete(id);
   res.redirect('/occasions');
}))

module.exports = router;