var Campground = require("../models/campground");
var Comment = require("../models/comment");


// all the middlware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    // is user logged in //we can use isLoggedIn
    //   console.log("HEREHEREHERE");
    //   var check = req.isAuthenticated();
    //   console.log(check);
    if(req.isAuthenticated()){
        //next();
      Campground.findById(req.params.id, function(err, foundCampground){
          if(err){
              req.flash("error", "Campground not found");
              res.redirect("back");
          } else {
               // does user own the campground
               //foundCampground.author.id is an object while req.user._id is a string
               if(foundCampground.author.id.equals(req.user._id)){
                  next();
              } else {
                 req.flash("error", "You don't have permission to do that");
                 res.redirect("back");
               }  
          }
      });
  } else {
         //takes the user where they came from
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
  }
     
      // otherwise, redirect
  //if not, redirect
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    // is user logged in //we can use isLoggedIn
    //   console.log("HEREHEREHERE");
    //   var check = req.isAuthenticated();
    //   console.log(check);
    if(req.isAuthenticated()){
        //next();
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            // does user own the comment
            //foundComment.author.id is an object while req.user._id is a string
            if(foundComment.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }  
        }
    });
    } else {
    //takes the user where they came from
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
    }
    
    // otherwise, redirect
    //if not, redirect
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    //handle the flash in "/login"
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;