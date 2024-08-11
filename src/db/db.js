import mongoose from "mongoose"
const dbConnect=async ()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(connectionInstance.connection.host);
    }catch(e){
        throw(e.message);
        process.exit(1);
    }
}
export default dbConnect;