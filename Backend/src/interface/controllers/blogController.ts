import { Request, Response } from "express";
import BlogService from "../../app/useCases/blog";
import { assign } from "nodemailer/lib/shared";

class BlogController {
  private blogService: BlogService;

  constructor() {
    this.blogService = new BlogService();
  }

  createBlog = async (req: Request, res: Response) => {
    try {
      const blogData = req.body;
      const image = req.file as any;
      console.log("---------------", req.body);
      console.log("=========", image);

      if (blogData && image) {
        const result = await this.blogService.createBlog(blogData, image);

        res.status(200).json({
          success: true,
          messsage: "Blog has been uploaded",
          blog: result,
        });
      }
    } catch (error) {}
  };
  fetchBlogs = async (req: Request, res: Response) => {
    try {
      console.log("hyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
      const blogs = await this.blogService.fetchBlogs();
      res.status(200).json({ success: true, blogs });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching blogs" });
    }
  };
  singleBlog = async (req: Request, res: Response) => {
    try {
      console.log("========", req.params);
      const { blogId } = req.params;
      const result = await this.blogService.getSingleBlog(blogId);
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching blog" });
    }
  };
  fetchUserBLog = async (req: Request, res: Response) => {
    try {
      const { userId }: any = req.params;
      console.log("user blogs", userId);
      const result = await this.blogService.fetchUserBlog(userId);
      if (result) {
        res.status(200).json({
          success: result.success,
          message: result.message,
          blogs: result.blogs,
        });
      } else {
        res.status(400).json({ success: false, message: "No Blogs to show" });
      }
    } catch (error) {
      console.log("Error in fetching user blog", error);
      res
        .status(500)
        .json({ success: false, message: "Error fetching user blog" });
    }
  };
  updateBlog = async (req: Request, res: Response) => {
    try {
      const blogData = req.body;
      const image = req.file as any;
      const { blogId } = req.params;
      console.log('blog image',image)
      const result = await this.blogService.updateBlog(blogId, blogData,image);

      if (result.success) {
        res.status(200).json({ success: true, message: result.message });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Error in updating blog:", error);
      res.status(500).json({ success: false, message: "Error updating blog" });
    }
  };
  deleteBlog = async(req:Request,res:Response)=>{
    try {
      const { blogId } = req.params;
      const result = await this.blogService.deleteBlog(blogId);
      if(result?.success){
        res.status(200).json({
          message: result?.message,
          success:result.success
        });  
      }
  
    } catch (error) {
      res.status(500).json({
        message:  'An error occurred while deleting the blog.',
      });
    }
  }
}

export const blogController = new BlogController();
