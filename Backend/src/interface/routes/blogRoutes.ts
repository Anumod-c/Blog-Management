import express from 'express';
import { userController } from '../controllers/userController';
import upload from '../../utils/multer';
import { blogController } from '../controllers/blogController';
import authMiddleware from '../middlewares/auth';

const blogRouter = express.Router();

blogRouter.post('/add-blog', authMiddleware,upload.single('image'),blogController.createBlog)
blogRouter.get('/fetch-blog',authMiddleware,blogController.fetchBlogs)
blogRouter.get('/single-blog/:blogId',authMiddleware, blogController.singleBlog)
blogRouter.get('/user-blogs/:userId',authMiddleware, blogController.fetchUserBLog)
blogRouter.put('/update-blog/:blogId',authMiddleware, upload.single('image'),blogController.updateBlog)
blogRouter.delete('/delete-blog/:blogId',authMiddleware,blogController.deleteBlog)
export default blogRouter
