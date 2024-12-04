import mongoose from "mongoose";

//DB-connection function
const dbConnection = async()=>{
try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("database connected");
} catch (error) {
    console.log("database connection error:",error);
    
}
}
export default dbConnection;