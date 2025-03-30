const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodeoverride=require("method-override")
const ejsMate= require("ejs-mate")
const expresserror=require("./utils/expresserror")
const listingsrouter=require("./routes/listing.js")
const reviewsrouter=require("./routes/review.js")
const session=require("express-session");
const { secureHeapUsed } = require("crypto");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");
const userrouter=require("./routes/user.js")

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodeoverride("_method"))
app.use(express.static(path.join(__dirname,"/public")));

const sessionoptions={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,// CROSS SHIFTING ATTACK 
    }
};


app.use(session(sessionoptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





// we are using flash to display messages to the user
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.usernoee;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeuser =new User({
//         email:"demouser",
//         username:"delta-student"

//     })
//   let register=  await User.register(fakeuser,"helloworld");
//   res.send(register);
// })



app.get("/",(req,res)=>{
    res.render("listings/home.ejs");
})

app.use("/listings",listingsrouter)
app.use("/listings/:id/reviews",reviewsrouter)
app.use("/",userrouter);

app.all("*",(req,res,next)=>{
    next(new expresserror(404,"page not found "));
})
app.use((err,req,res,next)=>{
   let{statusCode=500,message="something went wrong "}=err;
    res.status(statusCode).render("error.ejs",{message})
 }) 
app.listen(3001,()=>{
    console.log("server is listening to port 8080");
});