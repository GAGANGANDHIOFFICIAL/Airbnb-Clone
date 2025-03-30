const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const review=require("./review.js")
const listingschema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        set:(v)=>v===""?"https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});
listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await review.deleteMany({_id:{$in:listing.reviews}});
    }

})
const Listing =mongoose.model("Listing",listingschema);
module.exports=Listing;

