import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import Card from "../models/card.models";

const applyForCard = asyncHandler(async (req, res) => {
    const { cardName,cardType } = req.body;

    if (!cardName ||!cardType) {
        throw new ApiError(400, "Fill All Details");
    }
    const cardNumber=Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    const expiryDate=new Date().toISOString().slice(0,10);
    const cvv=Math.floor(100 + Math.random() * 900).toString();
    const user=req.user;
    const newCard = await Card.create({
        cardType,
        cardName,
        cardNumber,
        expiryDate,
        cvv,
        userId:user._id
    });
    const returnCard=await Card.findById(newCard._id).select("-cvv -userId ");

    if (!newCard) {
        throw new ApiError(400, "Something went wrong while creating the card");
    }

    return res.status(200).json(new ApiResponse(200, returnCard, "Card Applied Successfully"));
});
export {applyForCard};