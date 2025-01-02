export  interface IUser{
    username:string;
    email:string;
    password:string;
    phone:string;
    avatar?:string;
}

export interface userPayload{
    email:string;
    id:string;
}