import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import Transaction from "../models/transaction.models.js";
import { User } from "../models/users.models.js";
const initiateTransaction=asyncHandler(async (req,res)=>{
    //validate the fields
    //get sender
    //get receiver
    
    const {amount,upiId,phoneNo}=req.body;
    const sender=req.user;
    if(!amount){
        throw new ApiError(400,"Enter all Fields! Transaction declined!")
    }
    if(!upiId&&!phoneNo){
        throw new ApiError(400,"Enter all Fields! Transaction declined!")

    }
    const receiver = await User.findOne({ phoneNo })
    .select("userId name accountNo");  // Include only these fields

    if(!receiver){
        throw new ApiError(400,"Bad Request! No Account Holder with this credentials exists")
    }
    if(sender.balance<amount){
        throw new ApiError(400,"Not Enough Balance! Transaction declined!")

    }
    sender.balance-=amount;
    await sender.save({ validateBeforeSave: false })
    receiver.balance+=amount;
    await receiver.save({ validateBeforeSave: false });
    
   
    const transaction=await Transaction.create({
        sender:sender,
        receiver:receiver,
        amount:amount
    })

    
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {transaction},
            "Transaction completed Successfully"
        )
    )

});

const recentTransactions=asyncHandler(async(req,res)=>{
    const user=req.user;
    const transactions=await Transaction.aggregate(
        [
            {
                $match:{
                    $or:[
                        {sender:user._id},
                        {receiver:user._id}
                    ]
                }
            },
            {
                $addFields:{
                    transactionType:{
                        $cond:{
                            if:{$eq:["$sender",user._id]},
                            then:"Debit",
                            else:"Credit"
                        }
                    }
                }
            },
           {
                $project:{
                    _id:0,
                    transactionId:1,
                  
                    amount:1,
                    transactionType:1,
                    createdAt:1
                },
           },
            {
                $sort:{
                    createdAt:-1
                }
            }
        ]
    )
    if(!transactions){
        throw new ApiError(404,"No Transactions Found")
    }
    res.status(200).json(
        new ApiResponse(
            200,
            {transactions},
            "Recent Transactions"
        )
    )
})
export{initiateTransaction,recentTransactions}