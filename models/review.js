const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const reviewschema =new Schema({
    comment:{type:String,trim:true},
    rating:{
        type:Number,
        min:1,
        max:5

    },created_at:{type:Date,
        default:Date.now()
    }
})
module.exports =mongoose.model("review",reviewschema)