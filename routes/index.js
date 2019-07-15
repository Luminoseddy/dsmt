// ROUTES index.js

var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("dropships"); // this was "landing"
});

// show register form
router.get("/register", function(req, res){
  res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", "Data not found.");
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
          req.flash("success", "Account " + user.username + " has been registered!");
          res.redirect("/dropships"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
  res.render("login", {message: req.flash("error")}); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/dropships",
        failureRedirect: "/login"
    }), function(req, res){
});



// logout route
router.get("/logout", function(req, res){
  req.logout(); 
  req.flash("success", "You have succesfully logged out."); // Do this before redirecting.
  res.redirect("/dropships");
});



//middleware
// Moved to the middleware file 
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;