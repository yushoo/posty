var mongoose = require("mongoose");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String,
   author: {
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
        //embedding or referencing comment id to the campground objects
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
 
//MODEL SETUP THAT USES CAMPGROUNDSCHEMA
module.exports = mongoose.model("Campground", campgroundSchema);