import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    userId:{
        type:String,
        required:true,
        trim:true,
        unique:true,

    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength: 8,
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    },
    accountNo:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        minlength:10,
        match: /^\d+$/,
    },
    phoneNo:{
        type:String,
        required:true,
        trim:true,
        
        match: /^\d+$/,
        minlength:10
    },
    balance:{
        type:Number,
        min:0

    },
    profileImage:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNKfj6RsyRZqO4nnWkPFrYMmgrzDmyG31pFQ&s"
    
    },
    refreshToken:{
        type:String
    }

},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }this.password=await bcrypt.hash(this.password,10);
    next();

})
userSchema.methods.isPasswordCorrect=async function(password){
    console.log(password);
    console.log(this.password)
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=async function(){
    return jwt.sign(
        {_id:this.id,},
        process.env.JWT_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
)    }

userSchema.methods.generateRefreshToken=async function (){
    return jwt.sign(
        {_id:this.id,},
        process.env.JWT_TOKEN_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
)    }

export const User=mongoose.model("User",userSchema);
    
        