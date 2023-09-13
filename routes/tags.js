const express = require('express')
const router = express.Router({mergeParams: true}); //so that we have access to parameter occasion_id
const catchAsync = require('../utils/catchAsync');
const Occasion = require('../models/occasions');
const Tag = require('../models/tag');

router.get('/', catchAsync(async (req, res) => {
        const occasion = await Occasion.findById(req.params.id);
       // res.json(occasion.tags[0]);
       const tag_id = occasion.tags[0]
        const tagRetrieved = await Tag.find({_id : tag_id})
        res.json(tagRetrieved);
}))

router.post('/', catchAsync(async (req, res) => {
   const occasion = await Occasion.findById(req.params.id);
   const tag = new Tag(req.body.tag);
   tag.tag=req.body;
   occasion.tags.length = 0;
   occasion.tags.unshift(tag);
   await tag.save();
   await occasion.save();
   req.flash('success', 'Successfully created new tag list');
   res.redirect(`/occasions/${occasion._id}`);
}))

router.delete('/:tagId', catchAsync(async (req, res) => {
   const { id, tagId } = req.params;
   await Occasion.findByIdAndUpdate(id, {  $pull: { reviews: tagId } });
      //update reference to review objectid. $pull removes one or all occurences of a value in array
   await Review.findByIdAndDelete(req.params.tagId); //delete review
   req.flash('success', 'Successfully modified the tag list');

   res.redirect(`/occasions/${id}`);
}))

module.exports = router;