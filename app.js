const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const {occasionSchema, reviewSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Occasion = require('./models/occasions');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/hangout-planner',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.json()); //added for chatgpt ai middleware. find out why
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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

const validateReview = (req, res, next) => {
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

app.get('/', (req, res) => {
   res.send('home');
})

app.get('/occasions', catchAsync(async (req, res) => {
   const occasions = await Occasion.find({});
   res.render('occasions/index',{ occasions });
}))

app.get('/occasions/new', async (req, res) => {
   const occasions = await Occasion.find({});
   res.render('occasions/new');
})

app.post('/occasions', validateOccasion, catchAsync(async (req, res, next) => {
   //if(!req.body.occasion) throw new ExpressError('Invalid Occasion Data', 400);
   const occasion = new Occasion(req.body.occasion);
   await occasion.save();
   res.redirect(`/occasions/${occasion._id}`);
}))

app.get('/occasions/:id', catchAsync(async (req, res) => {
   const occasion = await Occasion.findById(req.params.id).populate('reviews');
   res.render('occasions/show', { occasion }); //.populate expands the id in reviews to full object
}))

app.get('/occasions/:id/edit', catchAsync(async (req, res) => {
   const occasion = await Occasion.findById(req.params.id);
   res.render('occasions/edit', { occasion });
}))

app.put('/occasions/:id', validateOccasion, catchAsync(async (req, res) => {
   const { id } = req.params;
   const occasion = await Occasion.findByIdAndUpdate(id, {...req.body.occasion});
   res.redirect(`/occasions/${occasion._id}`)
}))

app.delete('/occasions/:id', catchAsync(async (req, res) => {
   const { id } = req.params;
   await Occasion.findByIdAndDelete(id);
   res.redirect('/occasions');
}))


app.post('/occasions/:id/reviews', validateReview, catchAsync(async (req, res) => {
   const occasion = await Occasion.findById(req.params.id);
   const review = new Review(req.body.review);
   occasion.reviews.push(review);
   await review.save();
   await occasion.save();
   res.redirect(`/occasions/${occasion._id}`);
}))

app.delete('/occasions/:id/reviews/:reviewId', catchAsync(async (req, res) => {
   const { id, reviewId } = req.params;
   await Occasion.findByIdAndUpdate(id, {  $pull: { reviews: reviewId } });
      //update reference to review objectid. $pull removes one or all occurences of a value in array
   await Review.findByIdAndDelete(req.params.reviewId); //delete review
   res.redirect(`/occasions/${id}`);
}))


app.all('*', (req, res, next) => { //is only triggered if it doesn't match any path or action route above
   //res.send("404!!")
   next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
   const {statusCode=500} = err;
   if (!err.message) err.message = 'Oh No, Something Went Wrong!'
   res.status(statusCode).render('error', { err });
})

app.listen(3000, ()=>{
   console.log('Serving on port 3000')
})