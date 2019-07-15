var mongoose = require("mongoose");
var Dropship = require("./models/dropship");
var Comment = require("./models/comment");

var data = []
    




// This gets executed into the app.js class into seedDB();
// Wipes out the database
function seedDB(){
    // Dropship.remove({}, function(err){
    //     console.log("remove items");
    //     if(err){
    //         console.log(err);
    //     }
    //     console.log("removed items!!");
        // Add few items
        data.forEach(function(seed){
            Dropship.create(seed, function(err, dropship){
                if(err){
                    console.log(err);
                } else{
                    // console.log("added a book");
                    // Create a comment
                    Comment.create(
                        {
                            text: "_test_ ",
                            author: "Testing"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            }else{
                                dropship.comments.push(comment);
                                dropship.save();
                                console.log("New comment has been created");
                            }
                            
                        });
                }
            });
        // }); // This is with Dropship.remove({})
    });
// add few comments
}
module.exports = seedDB;



 



