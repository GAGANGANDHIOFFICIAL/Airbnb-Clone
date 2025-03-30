module.exports.isLogged=(req,res,next)=>{
    console.log(req.path," ..",req.originalUrl)
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "you must be login to create ")
       return  res.redirect("/login")
    }
    next();


}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
