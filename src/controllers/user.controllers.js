import { User } from "../models/users.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import cookie from "cookie-parser";

// Create a new user
const createUser = asyncHandler(async (req, res) => {
    const { name, userId, password, accountNo, phoneNo, balance } = req.body;

    if (!name || !userId || !password || !accountNo || !phoneNo || !balance) {
        throw new ApiError(400, "Fill All Details");
    }

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
        throw new ApiError(400, "User Already Exists");
    }

    const newUser = await User.create({
        name,
        userId,
        password,
        accountNo,
        phoneNo,
        balance
    });

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(400, "Something went wrong while creating the user");
    }

    return res.status(200).json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

// Generate access and refresh tokens
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
       
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (e) {
        throw new ApiError(500, "Something Went Wrong While Generating the Tokens!");
    }
};

// Log in an existing user
const loginUser = asyncHandler(async (req, res) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
        throw new ApiError(400, "Please Enter The Required Fields!");
    }

    const user = await User.findOne({ userId });
    if (!user) {
        throw new ApiError(400, "User Doesn't Exist! Please Create an Account First");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Please enter a Valid Password!");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const options = {
        httpOnly: true,
        secure: true
    };

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: createdUser,
                    accessToken
                },
                "User Logged In Successfully!"
            )
        );
});
const validateUser=asyncHandler(async(req,res)=>{
    const user=req.user;
    res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                user:user
            },
            "Token Validated Successfully"
        )
    );
})

export { createUser, loginUser,validateUser };
