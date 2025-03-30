const express=require("express")
const router=express.Router();
const User=require("../models/user.js")
const wrapAsync=require("../utils/wrapasnyc.js")
const passport=require("passport");
const { saveRedirectUrl } = require("../midddleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",async (req,res)=>{
    try{
        let{username ,email,password}=req.body;
        const newuser=new User({email,username});
        const registered= await User.register(newuser,password);
        console.log(registered)
        req.flash("success","welcome to wanderlust")
        res.redirect("/listings")

    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
   
})
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login",saveRedirectUrl, 
    passport.authenticate("local", 
        { failureRedirect: "/login", failureFlash: true }), async (req, res) => {

    req.flash("success","welcome back to wander lust")
    let redirecturl=res.locals.redirectUrl || "/listings";
    res.redirect(redirecturl);   
   
})
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","yu are logout now")
        res.redirect("/listings")
    })

})





module.exports=router;