import mongoose from "mongoose";

import config from "../config/config";


 export const conntectDB = async ()=>{
    try {
        await mongoose.connect(config.mongoUri||'')
        console.log('Database connected')
    } catch (error) {
        console.error('Database connection error:', error);
    process.exit(1);
    }
}
