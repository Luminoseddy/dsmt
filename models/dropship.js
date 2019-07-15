var mongoose = require("mongoose");

// Schema setup; MONGOO/MODEL/CONFIG
// To run type: mongo >> use restful_dropship_app >> db.dropships.find() 
var dropshipSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    bio: String,
    genre: String,
    publishedInfo: String,
    rating: String,
    dropshipAuthor:  String ,
    created: {type: Date, default: Date.now}
    
});

module.exports = mongoose.model("Dropship", dropshipSchema);