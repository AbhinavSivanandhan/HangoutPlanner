const express =  require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');

router.get('/register', (req, res) => {
   res.render('users/register');
});
router.post('/register', catchAsync(async(req, res) => {
   try{
   const {email, username, password} = req.body;
   const user = new User({email, username});
   const registeredUser = await User.register(user, password); //calculates hashed & salted value
   console.log(registeredUser);
   req.login(registeredUser, err => {
      if(err) return next(err);
      req.flash('success','Welcome to Hangout Planner');
      res.redirect('/occasions'); 
   })
   }catch(e){
      req.flash('error', e.message);
      res.redirect('/register');
   }
}));

router.get('/login', (req, res) => {
   res.render('users/login');
})

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => {
   req.flash('success', 'welcome back!');
   const redirectUrl = res.locals.returnTo || '/occasions';
   delete req.session.returnTo;
   res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
   req.logout(function(err) {
      if (err) { return next(err); }
   req.flash('success', 'Goodbye!');
   res.redirect('/occasions');
   });
})

module.exports = router;

