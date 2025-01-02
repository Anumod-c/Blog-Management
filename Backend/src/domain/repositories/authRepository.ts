import { response } from "express";
import User from "../../models/userModel";
import tempUser from "../../models/tempUserModel";
import { IUser } from "../entities/IUser";

export class AuthRepository {
  //while registering checking if a email exist or not
  async findByEmail(email: string) {
    try {
      console.log("Email", email);
      const user = await User.findOne({ email: email });
      return user;
    } catch (error) {
      console.log("Error in findbyemail", error);
    }
  }
  //creating a tempUser
  async createTempUser(user: IUser) {
    try {
      const temporaryUser = await tempUser.findOne({ email: user.email });
      if (temporaryUser) {
        console.log("existing");
        return false;
      }
      const result = await tempUser.create(user);
      console.log("saved temp user", result);
      return result;
    } catch (error) {
      console.log("Error in saving temp user in repository", error);
      return false;
    }
  }
  //checking the email verification through tempUser

  async verifyEmail(email: string) {
    try {
      const temporaryUser = await tempUser.findOne({ email: email });

      return temporaryUser;
    } catch (error) {
      console.log("Error in fetching user with email from tempModel", error);
    }
  }
//creating a user
  async createUser(userData: IUser) {
    try {
      const user = await User.create(userData);
      return user;
    } catch (error) {
      console.log("Error in creating user in user collection", error);
    }
  }
  async deleteTempUser(email: string) {
    try {
      const result = await tempUser.deleteOne({ email });
      return result.deletedCount > 0;
    } catch (error) {
      console.log("Error in deleteTempUser:", error);
      return false;
    }
  }
 
}
