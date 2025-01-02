import mongoose from  'mongoose';
 import { IUserModel } from '../domain/entities/IAuth';

 export interface IUserDoucuments extends IUserModel,Document{}
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone:{
    type:String,
    required:true,
    trim:true,
  },
  bio:{
    type:String,
    trim:true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  avatar:{
    type:String,
  }
}, {
  timestamps: true
});



const User = mongoose.model<IUserDoucuments>('User', userSchema);

export default User