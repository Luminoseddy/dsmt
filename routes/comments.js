// Routes index.js

var express = require("express");
var router  = express.Router({mergeParams: true});
var Dropship    = require("../models/dropship");
var Comment = require("../models/comment");
var middleware = require("../middleware");



/*
============================================
COMMENTS NEW
============================================ */
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find dropshipper by id
    console.log(req.params.id);
    Dropship.findById(req.params.id, function(err, dropship){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {dropship: dropship});
        }
    });
});


/*
============================================
COMMENTS CREATE
============================================ */
router.post("/", middleware.isLoggedIn, function(req, res){
  //lookup book using ID
  Dropship.findById(req.params.id, function(err, dropship){
      if(err){
          console.log(err);
          res.redirect("/dropships");
      } else {
        Comment.create(req.body.comment, function(err, comment){
          if(err){
              req.flash("error", "Something went totally wrong..DATA 0110101")
              console.log(err);
          } else {
              // add username and id to comment
              comment.author.id = req.user._id; // this is how the model is designed
              comment.author.username = req.user.username;
              // save comment
              comment.save();
              dropship.comments.push(comment);
              dropship.save();
              req.flash("success", "Comment posted!")
              res.redirect('/dropships/' + dropship._id);
          }
        });
      }
  });
});



/*
============================================
COMMENT EDIT ROUTE
============================================ */
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
            res.send("EDIT ROUTE ASEEREEEE");
        }else{
            res.render("comments/edit", {dropship_id: req.params.id, comment: foundComment});
        }
    });
});



/*
============================================
COMMENT UPDATE ROUTE
============================================ */
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/dropships/" + req.params.id);
        }
    });
});



/*
============================================
COMMENT DESTROY ROUTE
============================================ */
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
            res.redirect("back");
       }else{
           res.redirect("/dropships/" + req.params.id);
       }
   });
});

module.exports = router;