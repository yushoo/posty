var express= require("express");
//merge the params from campground and comments
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//index is automatically first checked if calling only the directory
var middleware = require("../middleware/");

//=================================================================================================================
// COMMENTS ROUTES
//=================================================================================================================

//comments new
router.get("/new",middleware.isLoggedIn, function(req, res){
    //grab campground id from url. Thats why you have to stay on the same url so that the
    //id does not change
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log("sadfasfasfaasdf");
            console.log(err);
        } else {
            res.render("./comments/new", {campground:campground});
        }
    });
});

//comments create
router.post("/",middleware.isLoggedIn, function(req, res){
    //Lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
           

            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
    //Create new comment 
    //Connect new comment to campground
    //redirect campground show page
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership ,function(req, res){
    //campground id is already in req.params.id
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// COMMENT UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership ,function(req, res){
    //3 params. target. Info to update. 
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership ,function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }   else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }   
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
};

function checkCommentOwnership(req, res, next){
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
                 res.redirect("back");
               }  
          }
      });
  } else {
      //takes the user where they came from
  
      res.redirect("back");
  }
     
      // otherwise, redirect
  //if not, redirect
}


module.exports = router;