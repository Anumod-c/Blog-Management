import Blog from "../../models/blogModel";
import { IBlog } from "../entities/IBlog";

export class BlogRepository {
  async createBlog(blogData: any) {
    try {
      const blog = await Blog.create(blogData);
      console.log("--database data-", blog);
      return blog;
    } catch (error) {
      console.log("Error in creating the blog", error);
    }
  }
  async fetchBlogs() {
    try {
      const blogs = await Blog.find()
        .populate("author", "username avatar") // Populate username and avatar
        .sort({ createdAt: -1 }); // Sort by latest blogs
      console.log("blogsssssssssss", blogs);
      return blogs;
    } catch (error) {
      console.error("Error in fetching blogs", error);
      throw error;
    }
  }
  async getSingleBlog(blogId: string) {
    try {
      const blog = await Blog.findById(blogId).populate("author", "username avatar");
      return blog;
    } catch (error) {
      console.log("Error in fetching single blog", error);
      return false;
    }
  }
  async fetchUserBlog(userId: string) {
    try {
      const blogs = await Blog.find({ author: userId }).sort({createdAt:-1});
      return blogs;
    } catch (error) {
      console.log("Error in fetching user blog", error);
    }
  }
  async updateBlog(blogId: string, blogData: IBlog) {
    try {
      const updatedBlog = await Blog.updateOne(
        { _id: blogId }, // Filter by ID
        { $set: blogData } // Fields to update
      );
  
      return updatedBlog; // Contains matchedCount and modifiedCount
    } catch (error) {
      console.error("Error in updating blog details:", error);
      throw error; // Re-throw error for the service layer to handle
    }
  }
  async deleteBlogById(blogId:string){
    try {
      const deletedBlog = await Blog.findByIdAndDelete(blogId);
      return deletedBlog !== null;
    } catch (error) {
      throw new Error('Error deleting the blog.');
    }
  }
}
