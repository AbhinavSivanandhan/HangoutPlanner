const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
//const User = require('./user');
const Tag = require('./tag');

const ImageSchema = new Schema({
   url: String,
   filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload', '/upload/w_200');
});

const occasionSchema = new Schema({
   title: String,
   images: [ImageSchema],
   geometry: {
      type:{
         type: String,
         enum: ['Point'],
         required: true
      },
   coordinates: {
      type: [Number],
      required: true
      }
   },
   price: Number,
   description: String,
   location: String,
   participants: String,
   startDate: Date, 
   endDate: Date,
   author: {
         type: Schema.Types.ObjectId,
         ref: 'User'
   },
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Review'
      }
   ],
   tags: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Tag'
      }
   ]
});

occasionSchema.post('findOneAndDelete', async function (doc) { //this will only work if findIdandDelete occcasion route is used, if that is modified then this middleware won't be triggered
   if (doc) {
      await Review.deleteMany({
         _id: {
            $in: doc.reviews
         }
      })
   }
})

occasionSchema.post('findOneAndDelete', async function (doc) { //this will only work if findIdandDelete occcasion route is used, if that is modified then this middleware won't be triggered
   if (doc) {
      await Tag.deleteMany({
         _id: {
            $in: doc.tags
         }
      })
   }
})

module.exports = mongoose.model('Occasion', occasionSchema);
