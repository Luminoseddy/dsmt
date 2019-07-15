// ROUTES books.js
var express = require("express");
var router  = express.Router();
var Dropship    = require("../models/dropship");
var middleware = require("../middleware")


/*
===============================
INDEX: Show all the books.
=============================== */
router.get("/", function(req, res){
    // Get all books from DB
    Dropship.find({}, function(err, allDropships){
      if(err){
          console.log(err);
      } else {
          res.render("dropships/index", {dropships:allDropships});
      }
    });
});



/*
========================================
CREATE - Add new books into the db.
======================================== */
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    
    var genre = req.body.genre;
    var dropshipAuthor = req.body.dropshipAuthor;
    var publishedInfo = req.body.publishedInfo;
    var rating = req.body.rating;
    var bio = req.body.bio;
    var author = {
        id: req.user._id, 
        username: req.user.username
    };
    var newDropship ={ name : name, 
                   image: image, 
                   description: desc, 
                   author: author, 
                   genre: genre, 
                   dropshipAuthor: dropshipAuthor, 
                   publishedInfo: publishedInfo,
                   rating: rating,
                   bio: bio };
    // Create a new book and save to DB
    Dropship.create(newDropship, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to book page
            console.log(newlyCreated);
            res.redirect("/dropships");
        }
    });
});



/*
===============================================
NEW - Shows the form to create a new book
=============================================== */
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("dropships/new"); 
});



/*
============================================
SHOW - shows additional book details.
============================================ */
router.get("/:id", function(req, res){
    //find the book with provided ID
    Dropship.findById(req.params.id).populate("comments").exec(function(err, foundDropship){
        if(err){
            console.log(err);
        } else {
            console.log(foundDropship)
            //render show template with that book
            res.render("dropships/show", {dropship: foundDropship});
        }
    });
});



/*
============================================
EDIT BOOKS ROUTE
============================================ */
router.get("/:id/edit", middleware.checkDropshipOwnership, function(req, res){
        Dropship.findById(req.params.id, function(err, foundDropship){
            // req.flash("error", "Sorry, item not found.")
            res.render("dropships/edit", {dropship: foundDropship});
        });
});



/*
============================================
UPDATE BOOK ROUTE
============================================ */
router.put("/:id", middleware.checkDropshipOwnership, function(req, res){
    // res.send("TESTING: UPDATE ROUTE!" );
    // req.body.book.body = req.sanitize(req.body.book.body);
    Dropship.findByIdAndUpdate(req.params.id, req.body.dropship, function(err, updatedDropship){
        if(err){
            res.redirect("/dropships");
        }else{
            res.redirect("/dropships/" + req.params.id);
        }
    });
});



/*
============================================
DESTROY ROUTE
============================================ */
router.delete("/:id", middleware.checkDropshipOwnership, function(req, res){
    // res.send("We have succesfully deleted the dropship.");
    // destroy the dropship item
    Dropship.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/dropships");
        }else{
            res.redirect("/dropships");
        }
    });
});


module.exports = router;

