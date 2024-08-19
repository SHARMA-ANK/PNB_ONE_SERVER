import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";

const servicesRouter = Router();

servicesRouter.route('/applyForCard').get(verifyJwt, );