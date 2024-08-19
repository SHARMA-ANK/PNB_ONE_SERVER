import { Router } from "express";
import { createUser, loginUser, validateUser } from "../controllers/user.controllers.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const userRouter=Router();

userRouter.route('/register').post(storage,createUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/validate').get(verifyJwt,validateUser);

export default userRouter;