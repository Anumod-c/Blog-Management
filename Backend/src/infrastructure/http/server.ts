import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from '../../interface/routes/authRoute';
import { conntectDB } from '../database/dbConnection';
import userRouter from '../../interface/routes/userRoutes';
import blogRouter from '../../interface/routes/blogRoutes';
dotenv.config()
const app = express();
app.use(express.json());
const PORT = process.env.PORT;
const  corsOption={
    origin:'*',
    methods:['POST','PUT','GET','DELETE'],
    credentials:true
}
app.use(cors(corsOption));
conntectDB()
app.use('/auth',authRouter);
app.use('/user',userRouter);
app.use('/blog',blogRouter);



app.listen(PORT,()=>{
    console.log('Server running in port',PORT)
})
