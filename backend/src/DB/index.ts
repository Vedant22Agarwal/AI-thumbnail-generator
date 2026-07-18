import mongoose from "mongoose";

 const connectDB = async () => {
    try{
       const connectionInstance =  await mongoose.connect(process.env.MONGODB_URI as string);
       console.log(`\n MONGO_DB connected!! DB HOST : ${connectionInstance.connection.host}`);
    }
    catch(error){
        console.error("MONGO_DB connection Error",error);
        process.exit(1);
    }
}
export default connectDB;
