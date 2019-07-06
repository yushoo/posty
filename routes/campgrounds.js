var express= require("express");
var router = express.Router();
var Campground = require("../models/campground");
//index is automatically first checked if calling only the directory
var middleware = require("../middleware/");

//for the REST convention: If you want to display campgrounds use get "/campgrounds"
//If you want to add more campgrounds we need to use post "/campgrounds"
//INDEX - show all campgrounds
router.get("/",function(req,res){
    // Get all campgrounds from DB
    Campground.find({},function(err, allCampgrounds){
        if(err){
            
            console.log(err);
        } else {
            //source of campgrounds is now from the DB
            
            res.render("./campgrounds/index",{campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//CREATE - Add new campground to DB
router.post("/",isLoggedIn ,function(req,res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username:req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author:author}
    //Create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            //default redirect is the GET request
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show the form that will send the data to the post route
router.get("/new",middleware.isLoggedIn ,function(req, res){
    res.render("./campgrounds/new");
});

//SHOW - has to be placed after /campgrounds/new
router.get("/:id", function(req, res){
    //find the campground with provided ID, then populating comments on that campground to
    //replace the id with actual comments, then with exec we are executing the query 
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
             //render show template with that campground
             //console.log(foundCampground);
            res.render("./campgrounds/show", {campground: foundCampground});
        }
    });
   
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit" ,middleware.checkCampgroundOwnership ,function(req, res){
               // console.log(foundCampground.author.id);
                 // does user own the campground
                 //foundCampground.author.id is an object while req.user._id is a string
                 Campground.findById(req.params.id, function(err, foundCampground){
                     res.render("campgrounds/edit", {campground: foundCampground});
              });
        // otherwise, redirect
    //if not, redirect
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership ,function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
    //redirect somewhere(show page)
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership ,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        var ex = next;
        console.log(ex);
        return next();
    } 
    res.redirect("/login");
};

function checkCampgroundOwnership(req, res, next){
      // is user logged in //we can use isLoggedIn
    //   console.log("HEREHEREHERE");
    //   var check = req.isAuthenticated();
    //   console.log(check);
      if(req.isAuthenticated()){
          //next();
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                 // does user own the campground
                 //foundCampground.author.id is an object while req.user._id is a string
                 if(foundCampground.author.id.equals(req.user._id)){
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