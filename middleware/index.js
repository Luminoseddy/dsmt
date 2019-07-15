// All the middle ware is in here
var Dropship = require("../models/dropship");
var Comment = require("../models/comment");

// All middleware goes here.
var middlewareObj = {};

middlewareObj.checkDropshipOwnership = function (req, res, next){
    // is user logged in?
    if(req.isAuthenticated()){
        Dropship.findById(req.params.id, function(err, foundDropship){
            if(err){
                res.redirect("back");
            }else{
                // does user own the book?
                if(foundDropship.author.id.equals(req.user._id)){
                   next();
                } else{
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You must be logged in to do that."); // Rare to occur, only occurs if user plays with URL to access this.
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next){
    // is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Sorry, item not found.");
                res.redirect("back");
            }else{
                // did that user create that comment?
                if(foundComment.author.id.equals(req.user._id)){
                   next();
                } else{
                    req.flash("error", "Sorry, this account does not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        // Must be done before redirecting
        req.flash("error", "You must be logged in to do that."); // "Error" is they key, to display the message.
        res.redirect("/login");
}

module.exports = middlewareObj;