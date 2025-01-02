import { useLocation } from "react-router-dom";
import Navbar from "../user/Navbar";
import { useEffect, useState } from "react";
import axiosInstance from "../../constraints/axios/userAxios";
import { blogEndpoints } from "../../constraints/endpoints/blogEnpoints";
import { IBlog } from "../../interface/IBlog";

const SingleBlog: React.FC = () => {
  const blogId = useLocation();
  const [blog, setBlog] = useState<IBlog | null>(null);

  useEffect(() => {
    const fetchSingleBlog = async () => {
      try {
        const response = await axiosInstance.get(`${blogEndpoints.singleblog}/${blogId.state}`);
        if (response.status === 200) {
          setBlog(response.data.result.result);
        }
      } catch (error) {
        console.log('Error in loading single blog page', error);
      }
    };
    fetchSingleBlog();
  }, [blogId]);

  if (!blog) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-gray-50">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Container */}
            <div className="w-full lg:w-1/2 p-4 md:p-6 lg:p-8">
              <div className="relative pb-[75%] md:pb-[66.66%] lg:pb-[56.25%]">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
            </div>

            {/* Content Container */}
            <div className="w-full lg:w-1/2 p-4 md:p-6 lg:p-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {blog.title}
              </h1>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <img 
                    src={blog.author.avatar || `https://ui-avatars.com/api/?name=${blog.author.username}`}
                    alt={blog.author.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Author</p>
                    <p className="font-medium">{blog.author.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {blog.description}
                </p>
              </div>

              {/* Additional Metadata */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between font-semibold text-sm text-gray-500">
                  <span>Posted {new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span> 5 min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBlog;