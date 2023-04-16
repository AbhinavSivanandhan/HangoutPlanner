const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const {occasionSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const occasions = require('./routes/occasions');
const reviews = require('./routes/reviews');

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

app.use('/occasions', occasions)
app.use('/occasions/:id/reviews', reviews)

app.get('/', (req, res) => {
   res.send('home');
})

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