const {occasionSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Occasion = require('./models/occasions');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()){
      req.session.returnTo = req.originalUrl; //can add whatever variable we want, so we add a var called returnTo to track the path
      req.flash('error','You must be signed in first!');
      return res.redirect('/login');
   }
   next(); 
}
module.exports.storeReturnTo = (req, res, next) => {
   if (req.session.returnTo) {
       res.locals.returnTo = req.session.returnTo;
   }
   next();
}

module.exports.validateOccasion = (req, res, next) => {
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

module.exports.isAuthor = async(req, res, next) => {
   const { id } = req.params;
   const occasion = await Occasion.findById(id);
   if (!occasion.author.equals(req.user._id)){
      req.flash('error', 'You do not have permission to do that!');
      return res.redirect(`/occasions/${id}`)
   }
   next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
   const { id, reviewId } = req.params;
   const review = await Review.findById(reviewId);
   if (!review.author.equals(req.user._id)){
      req.flash('error', 'You do not have permission to do that!');
      return res.redirect(`/occasions/${id}`)
   }
   next();
}

module.exports.validateReview = (req, res, next) => {
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