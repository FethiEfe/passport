const express               = require("express"),
      mongoose              = require("mongoose"),
      passport              = require("passport"),
      LocalStrategy         = require("passport-local"),
      User                  = require("./models/user"),
      session               = require("express-session")
      passportLocalMongoose = require("passport-local-mongoose");


const PORT = 4001;
const app = express();
app.use(express.json())
      
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/auth_demo", {useNewUrlParser: true})

app.use(session({
    secret : "Being alive is expensive",
    resave : false,
    saveUninitialized: false,
    cookie : {
        maxAge: 1000 * 60 * 60 * 24
    }

}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/")
}
app.get("/", (req,res)=>{
    res.send("successful")
})
app.post("/register", (req,res) => {
    const {username, password} = req.body
    //User.register function is provided by passport-local-mongoose. it hashes the password
    User.register( new User({username}), password, (err, user) => {
        if(err){
            console.log(err)
        }else {
            passport.authenticate("local")(req,res, () => {
                res.send(user)
            })
        }
    })
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/myprofile",
    failureMessage : "/login"
}),(req,res) =>{
})

// or 
// app.post("/login", passport.authenticate("local"),(req,res) =>{
//     //  If this function gets called, authentication was successful.
//     res.json(req.user)
// })


app.get("/logout", (req,res) => {
    // passport is destroying all the user data in the session
    req.logout()
    res.redirect("/")
})
app.listen(PORT, () => {
    console.log(`I am listening ${PORT}`)
})