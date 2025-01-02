import mongoose from  'mongoose';
 import { IUserModel } from '../domain/entities/IAuth';

 export interface IUserDoucuments extends IUserModel,Document{}
const tempUserSchema = new mongoose.Schema({
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
  expiresAt:{
    type:Date,
    required:true,
    default:Date.now(),
    expires:18000
  }
}, {
  timestamps: true
});



const tempUser = mongoose.model<IUserDoucuments>('TempUser', tempUserSchema);

export default tempUser