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