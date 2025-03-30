const express=require("express")
const router = express.Router();
const wrapAsync=require("../utils/wrapasnyc.js")
const {listingschema}=require("../schema")
const expresserror=require("../utils/expresserror")
const Listing =require("../models/listing.js")
const {isLogged}=require("../midddleware.js")
const validatelisting=(req,res,next)=>{
    let{error}=listingschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(404,errmsg);
}else{
    next();
}
}

//index route
router.get("/", wrapAsync(async (req,res)=>{
    const alllisting =  await Listing.find({});
   res.render("listings/index.ejs",{alllisting});
 }));
 // new route
 router.get("/new",isLogged, (req,res)=>{
    
    res.render("listings/new.ejs")
     
  });
 //show route
 router.get("/:id", wrapAsync(async (req,res)=>{
     let {id}=req.params;
     const listing=await Listing.findById(id)
     .populate("reviews")
     .populate("owner");
     if(!listing){
        req.flash("error","Listing you requested does not exist ");
        res.redirect("/listings");
     }
     console.log(listing)
     res.render("listings/show.ejs",{listing});
  }));
//create route
router.post("/",isLogged,validatelisting,
    wrapAsync(async(req,res,next)=>{
       
      const newlisting=new Listing(req.body.listing);
      
      newlisting.owner=req.user._id;
      
    await newlisting.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
        }
));
// edit route 
router.get("/:id/edit",isLogged,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
    
 }));

 //update route 
 router.put("/:id",isLogged,wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new expresserror(400,"send valid data baby");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
 }))
//delete 
router.delete("/:id",isLogged, wrapAsync(async (req, res) => {
    // console.log(req.body); // Log the incoming data
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    req.flash("success","   Listing deleted ");
    res.redirect("/listings");
}));



module.exports=router;


