import mongoose from "mongoose";

const cardSchema=new mongoose.Schema({
    cardNo:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        minlength:16,
        match: /^\d+$/
    },
    cvv:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        match: /^\d+$/
    },
    expiry:{
        type:Date,
        required:true
    },
    cardType:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},{timestamps:true})

const Card=mongoose.model("Card",cardSchema);
export default Card;