import { IUser } from "../../domain/entities/IUser";
import { UserRepository } from "../../domain/repositories/UserRepository";
import uploadImage from "../../utils/upload";
 interface Avatar{
    image: Express.Multer.File |undefined;
    id:string
 }
export class UserService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }
  //creating a tempUser and  sending an email for the user

  async changeAvatar(Avatar:Avatar) {
    try {

        const {image,id}=Avatar
        if (!image) {
          throw new Error("Image is required for changing avatar");
        }
      console.log(image, "--------------------");
      const imageUrl = await uploadImage(image);
      console.log("result after sending to cloudnary", imageUrl);
      if (imageUrl) {
        const result = await this.userRepository.changeAvatar(imageUrl,id);

        if(result){
            return {success:true,message:"Profile image uploaded sucessufully",imageUrl:result.avatar}
        }else{
            return { success: false, message: "An unexpected error occured" };
        }
      }
      return { success: false, message: "An unexpected error occured" };

    } catch (error) {
      console.log("Error in uploading image", error);
    }
  }

  async updateUser(userData:IUser){
    try {
        const  user = await this.userRepository.updateUser(userData);
        if(user){
            return {success:true,message:"Profile update sucessfully",user}
        }else{

            return {success:false,message:"Couldnt update profile, Please try again later",}
        }
    } catch (error) {
        console.log('Error in updating user details from userservice',error)
    }
  }
}
