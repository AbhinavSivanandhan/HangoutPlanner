if (process.env.NODE_ENV !== "production"){
   require('dotenv').config();
}

//console.log(process.env.SECRET)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash');
const {occasionSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const occasionsRoutes = require('./routes/occasions');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');
const tagsRoutes = require('./routes/tags');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
mongoose.set("strictQuery", false);
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
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
   secret: 'thisshouldbeabettersecret!',
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
   }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //helps store user in session
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
   // console.log(req.session);
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
})

app.get('/fakeUser', async(req, res) => {
   const user = new User({email: 'abhinavstar.anand@gmail.com', username: 'abhinavs2000' })
   const newUser = await User.register(user, 'chicken');
   res.send(newUser);
})

app.use('/occasions', occasionsRoutes)
app.use('/occasions/:id/reviews', reviewsRoutes)
app.use('/occasions/:id/tags', tagsRoutes)
app.use('/', usersRoutes)


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