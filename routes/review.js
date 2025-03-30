const express=require("express")
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasnyc.js")
const expresserror=require("../utils/expresserror")
const review =require("../models/review.js");
const {reviewschema}=require("../schema")
const Listing =require("../models/listing.js")

const validatereview=(req,res,next)=>{
    let{error}=reviewschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(404,errmsg);
}else{
    next();
}
}


// Post REVIEW ROUTE
router.post("/",validatereview ,
    wrapAsync(async(req,res)=>{
    let listing =   await  Listing.findById(req.params.id)
    let newreview=new review(req.body.review)
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","New Review created");
    res.redirect(`/listings/${listing._id}`)
    // console.log("new review saved ")
    // res.send("succesfully saved the data ")
}))
// delete review route 
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted ");
    res.redirect(`/listings/${id}`);

}))
module.exports=router;