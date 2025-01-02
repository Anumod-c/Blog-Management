import { ILogin, IUserModel } from "../../domain/entities/IAuth";
import { AuthRepository } from "../../domain/repositories/authRepository";
import userRouter from "../../interface/routes/userRoutes";
import { generateToken } from "../../jwt/jwtCreate";
import { sendEmailVerification } from "../../utils/email";
import bcrypt from 'bcrypt'
export class AuthService {
  private authRepository: AuthRepository;
  constructor() {
    this.authRepository = new AuthRepository();
  }
  //creating a tempUser and  sending an email for the user
  async register(values: IUserModel) {
    try {
      const user = await this.authRepository.findByEmail(values.email);
      if (!user) {
        const hashedPassword=  await bcrypt.hash(values.password,10)
        const tempUser ={...values,password:hashedPassword}
        const result: any = await this.authRepository.createTempUser(tempUser);
        if (result) {
          await sendEmailVerification(values.email);
          return {
            success: true,
            message:
              "A verification email has been sent to your registered email address. Please check your inbox to complete the registration process.",
          };
        } else {
          console.log("elseeeeeeeeeee");
          return {
            success: false,
            message:
              "Error creating account. Please verify your email to proceed.",
          };
        }
      } else {
        return {
          success: false,
          message:
            "Email already registered. Please log in or use a different email.",
        };
      }
    } catch (error) {
      console.log("error in registering", error);
      return {
        success: false,
        message: "An error occurred. Please try again later.",
      };
    }
  }
  //verifying email and creating a new user
  async verifyEmail(email: string) {
    try {
      const temporaryUser = await this.authRepository.verifyEmail(email);
      if (!temporaryUser) {
        return {
          success: false,
          message:
            "No matching temporary user found. Please ensure you have verified your email correctly.",
        };
      }

      const userData: IUserModel= {
        username: temporaryUser.username,
        email: temporaryUser.email,
        phone: temporaryUser.phone,
        password: temporaryUser.password,
      };

      const createdUser = await this.authRepository.createUser(userData);
      if (!createdUser) {
        return {
          success: false,
          message: "Failed to create user account. Please try again later.",
        };
      }

      const isDeleted = await this.authRepository.deleteTempUser(email);
      if (!isDeleted) {
        console.log("Failed to delete temporary user after verification.");
      }

      return {
        success: true,
        message: "User account successfully created and verified.",
      };
    } catch (error) {
      console.log("Error in verifying email for user creation:", error);
      return {
        success: false,
        message:
          "An error occurred during email verification. Please try again later.",
      };
    }
  }

  async login(data:ILogin){
    const {email,password}=data;
    try {
      const user = await this.authRepository.findByEmail(email);
      if(!user){
        return {success:false,message:"Invalid Email or Password"}
      }
       const passwordMatch = await bcrypt.compare(password,user.password);
       if(!passwordMatch){
        return {success:false,message:"Invalid Email or Password"}
       }
       const token= generateToken({email:user.email,id:user._id.toString()});
       const userData = {
        username:user.username,
        email:user.email,
        phone:user.phone,
        bio:user.bio,
        id:user._id,
        avatar:user.avatar,
       }
       return {success:true,token,userData,message:'Login succesfull'}
    } catch (error) {
      console.log('Error in login in usecase',error);
      return {success:false,message:'Something went wrong'}

    }
  }
  
}
