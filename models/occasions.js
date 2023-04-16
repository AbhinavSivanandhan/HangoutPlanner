const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const occasionSchema = new Schema({
   title: String,
   image: String,
   price: Number,
   description: String,
   location: String,
   participants: String,
   startDate: Date, 
   endDate: Date,
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Review'
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

module.exports = mongoose.model('Occasion', occasionSchema);
