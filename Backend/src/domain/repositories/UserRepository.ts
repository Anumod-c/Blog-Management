import User from "../../models/userModel";
import { IUser } from "../entities/IUser";

export class UserRepository {
  //while registering checking if a email exist or not

  async changeAvatar(upload: string, id: string) {
    try {
      const result = await User.findByIdAndUpdate(
        { _id: id }, // Find the document by ID
        { $set: { avatar: upload } }, // Update the avatar field
        { new: true } // Return the updated document
      );
      return result
    } catch (error) {
      console.error("Error in uploading profile picture", error);

      // Return a failure response with the error message
      return  false
       
    }
  }
  async updateUser(userData: IUser) {
    try {
        // Using `updateOne` with the `$set` operator to update user data
        const user = await User.updateOne(
            { email: userData.email }, // Find user by email
            { $set: userData } // Update all fields in userData
        );

        console.log(user, userData,'-------------------')
        if (user.modifiedCount === 0) {
            console.log('No user was updated, possible invalid email');
            return false; // No user was updated
        }

        return user; // Successfully updated
    } catch (error) {
        console.log('Error in updating user details in repository', error);
        return false; // Return false on error
    }
}

}
