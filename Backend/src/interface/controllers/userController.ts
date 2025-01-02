import { Request,Response } from "express";
import { UserService } from "../../app/useCases/user";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }
 //Adding user profile picture;
 
  editAvatar = async (req:Request,res:Response)=>{
    try {
        const image=req.file  ;
        const id = req.body.id
        console.log('iddddd',req.body.id)
        if(!image){
            res.json({success:false,message:'Soemthing went wrong. Please try again'})
        }
        console.log('hello',req.file)
        const result = await this.userService.changeAvatar({image,id});
        if(result){
            console.log('result in controller',result)
            res.status(200).json({ message:result.message,imageUrl:result.imageUrl,success:true})
        }

    } catch (error) {
        console.log("Error in addin user prfile picture",error)
    }
  }
   updateUser= async(req:Request,res:Response)=>{
    try {
        const result = await  this.userService.updateUser(req.body);
        if(result){
            res.status(200).json({success:result.success,message:result.message,user:result.user})
        }
        
    } catch (error) {
        console.log('Error in updating user details',error);
        res.status(500).json({success:false,message:'Something went wrong'})
    }
   }

}

export const userController = new UserController();
