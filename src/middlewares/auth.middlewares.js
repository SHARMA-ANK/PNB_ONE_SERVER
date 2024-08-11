import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
const verifyJwt=asyncHandler(async (req,res,next)=>{
    try{
        const token=req.cookies?.accessToken
        ||req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unauthorized Request. No token available")
            
        }
        const decodedToken=jwt.verify(token,process.env.JWT_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401,"Invalid token")
            
        }
        req.user=user;
        
        next();
    }catch(e){
        throw new ApiError(401,e.message)
    }
})

export{verifyJwt}