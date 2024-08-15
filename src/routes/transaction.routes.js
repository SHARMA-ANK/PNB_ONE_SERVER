import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { initiateTransaction, recentTransactions } from "../controllers/transaction.controller.js";

const transactionRouter=Router();

transactionRouter.route('/initiateTransaction').post(verifyJwt,initiateTransaction);
transactionRouter.route('/recentTransactions').get(verifyJwt,recentTransactions);

export default transactionRouter;