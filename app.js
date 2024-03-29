var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require ("mongoose"),
    flash            = require("connect-flash"), // npm install --save connect-flash
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    methodOverride   = require("method-override"),
    Dropship         = require("./models/dropship"),
    Comment          = require("./models/comment"),
    User             = require("./models/user"),
    seedDB           = require("./seeds"),
    expressSanitizer = require("express-sanitizer")
    
//requring routes
var    commentRoutes    = require("./routes/comments"),
       dropshipRoutes   = require("./routes/dropships"),
       indexRoutes      = require("./routes/index");
    
// Set up mongoose: title; image; body; dateCreated
// Must insert {useNewUrlParser: true} at the end for: versions > 3.1
mongoose.connect("mongodb://localhost/restful_dropship_app", ({useNewUrlParser: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static("public"));
app.use(methodOverride("_method")); // Looks for _method as parameter.
app.use(expressSanitizer()); // This must be after bodyParser or else it won't work
app.use(flash()); 
seedDB(); // seed database

// Passport configuration
app.use(require("express-session")({
    secret: "Testing new passport",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){ // middle-ware that runs in every single route
    res.locals.currentUser = req.user;           // Passing current.user to every single template, currentUser
    res.locals.error       = req.flash("error"); // if anything under flash, we'll call message.
    res.locals.success     = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/dropships", dropshipRoutes);
app.use("/dropships/:id/comments", commentRoutes);

app.get("/", function(req, res){
    res.redirect("/dropships");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is up and running...");
});

// Before coding
// 	- run ‘git status’
// 	- run command: ‘git pull’ inside geektext
// 	- add file: ‘git add .’ 
// 	- ‘git commit’ -m “anyMessage”
// 	- ‘git push origin master’ : pushes updated code to repo
// 	- ‘git pull’ : update yourself with everyones else code
	

// To run Project (2 tabs)

// - npm run dev “To run web pack server”
// - npm start
// localhost:8080




