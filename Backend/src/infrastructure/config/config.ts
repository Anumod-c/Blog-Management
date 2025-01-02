import dotenv from 'dotenv';

dotenv.config();

export default{
    port:process.env.PORT,
    mongoUri: process.env.MONGO_URI ,
    JWT_SECRET: process.env.JWT_SECRET ,
    imageStoragePath: 'uploads/',
    EMAIL:process.env.SMTP_MAIL,
    EMAIL_PASS :process.env.SMPT_PASS,
}