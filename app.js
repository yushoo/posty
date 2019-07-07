var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    seedDB          = require("./seeds"),
    Comment         = require("./models/comment");
     User        = require("./models/user");

var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index");

var port = process.env.PORT || 8080;

mongoose.connect("mongodb://localhost:27017/yelp_camp_v12",  { useNewUrlParser: true });
//mongodb+srv://dbHenry:starbucksHhffheefee426%2A@cluster0-ovtx4.mongodb.net/test?retryWrites=true&w=majority
//mongoose.connect("mongodb+srv://newuser2:starbuckshhffheefee@cluster0-ovtx4.mongodb.net/test?retryWrites=true&w=majority");
//use process.env.databaseURL in real projects

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//SEED DATABASE 
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "WASSUP",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    //passes currentUser withr req.user for all templates
    //whatever is in res.locals is what's available in our template
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    //this is a middleware so we need next() inorder to move on
    next();
}); 

app.use(indexRoutes);
//tell routes to start with "/campgrounds"
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(port,function(){
    console.log("our app is listening on " +port);
 });