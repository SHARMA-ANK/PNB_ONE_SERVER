import dotenv from "dotenv";
import { app } from "./app.js";
import dbConnect from "./db/db.js";
dotenv.config({
    path:'./env'
})

dbConnect().then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`DatabaseConnected and server Running on PORT ${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log("MongoDB connection failed!",err)
})