import { IBlog } from "../../domain/entities/IBlog";
import { BlogRepository } from "../../domain/repositories/blogRepository";
import uploadImage from "../../utils/upload";

export class BlogService {
  private blogRepository: BlogRepository;
  constructor() {
    this.blogRepository = new BlogRepository();
  }
  async createBlog(blogData: any, image: any) {
    try {
      const imageUrl = await uploadImage(image);
      if (imageUrl) {
        console.log("iamgeruleee", imageUrl);
        const { title, description, category, userId } = blogData;
        const blog = {
          title,
          description,
          category,
          author: userId,
          image: imageUrl,
        };
        console.log("======++++======", blog);
        const result = await this.blogRepository.createBlog(blog);
        if (result) {
          return { success: true, message: "blog as been posted" };
        } else {
          return { success: false, message: "Couldnt upload the post" };
        }
      }
    } catch (error) {
      console.log("Error in posting blog", error);
      return { successs: false, message: "Error in uploading post" };
    }
  }
  async fetchBlogs() {
    try {
      const blogs = await this.blogRepository.fetchBlogs();
      return { success: true, blogs };
    } catch (error) {
      return { success: false, message: "Error fetching blogs" };
    }
  }
  async getSingleBlog(blogId: string) {
    try {
      const result = await this.blogRepository.getSingleBlog(blogId);
      if (result) {
        return { success: true, result };
      }
    } catch (error) {}
  }
  async fetchUserBlog(userId: string) {
    try {
      const blogs = await this.blogRepository.fetchUserBlog(userId);
      if (blogs) {
        return { success: true, blogs };
      } else {
        return { success: false, message: "User blog fetched" };
      }
    } catch (error) {
      console.log("Error in fetching user blog", error);
    }
  }
  async updateBlog(blogId: string, blogData: IBlog,image:Express.Multer.File|undefined) {
    try {
      let imageUrl = null;
      // Upload image if provided
    if (image) {
      imageUrl = await uploadImage(image);
    }
    console.log('image url',image)
    const updatedData: IBlog = {
      ...blogData,
      image: imageUrl || blogData.image, // Keep existing image if a new one is not provided
    };
    console.log('updated data',updatedData)
      const result = await this.blogRepository.updateBlog(blogId, updatedData);

      if (result.matchedCount === 0) {
        return { success: false, message: "Blog not found" };
      }

      if (result.modifiedCount === 0) {
        return { success: false, message: "No changes were made" };
      }

      return { success: true, message: "Blog updated successfully" };
    } catch (error) {
      console.error("Error in updating blog details:", error);
      return { success: false, message: "Error updating blog details" };
    }
  }
  async deleteBlog(blogId:string){
    try {
      const isDeleted = await this.blogRepository.deleteBlogById(blogId);
      if (!isDeleted) {
      return {success:false,message:'Blog not found or could not be deleted'};
      }
    
      return {success:true,message:'Blog deleted successfully'};
    } catch (error) {
      
    }
  }
}

export default BlogService;
