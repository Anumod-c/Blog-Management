
export interface IUserModel {
    
  username: string;
  email: string;
  phone: string;
  bio?: string; 
  avatar?:string
  password: string;
  createdAt?: Date; 
  updatedAt?: Date; 
}
export interface ILogin{
    email:string,
    password:string
}