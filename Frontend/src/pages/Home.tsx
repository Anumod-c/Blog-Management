  import { useEffect, useState } from "react";
  import Navbar from "../components/user/Navbar";
  import { useNavigate } from "react-router-dom";
  import axiosInstance from "../constraints/axios/userAxios";
  import { blogEndpoints } from "../constraints/endpoints/blogEnpoints";
import { IBlog } from "../interface/IBlog";



  const HomePage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [blogs,setBlogs]=  useState<IBlog[]>([]);
    useEffect(() => {
      const fetchBlogs = async () => {
        try {
          console.log('hy')
          const response = await axiosInstance.get(blogEndpoints.fetchBlogs);
          if (response.status === 200) {
            console.log(response.data.blogs.blogs)
            setBlogs(response.data.blogs.blogs);
          }
        } catch (error) {
          console.error("Error fetching blogs:", error);
        }
      };
      
      fetchBlogs();
    }, []);
  

    const handleSingleBlog = (blogId:string) => {
      navigate(`/singleBlog`,{state:blogId});
    };
    
    const filteredBlog = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <>
        <Navbar />
        <div className="bg-gray-100 min-h-screen p-4">
          {/* Search Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
            <h1 className="text-xl font-bold mb-4 sm:mb-0">Blogs</h1>
            <div className="flex gap-2 w-full sm:w-2/3 items-center">
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Blog Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlog.map((blog) => (
              
              <div
              key={blog._id}
              onClick={() => handleSingleBlog(blog._id)}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
                {/* Profile Section */}
                <div className="flex items-center p-4 bg-gray-100">
                  <img
                    src={blog.author.avatar || `https://ui-avatars.com/api/?name=${blog.author.username}`}
                    alt={blog.author.username}
                    className="w-10 h-10 rounded-full border-2 shadow-sm"
                  />
                  <p className="ml-4 text-md font-semibold text-gray-800">
                  {blog.author.username}
                  </p>
                </div>

                {/* Blog Image */}
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-60 object-cover m-2 rounded-sm"
                />

                {/* Blog Details */}
                <div className="p-2">
                  <h2 className="font-bold text-xl text-gray-900 mb-3">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">
                    Category:{" "}
                    <span className="font-semibold text-gray-800 ">
                      {blog.category}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    Description:{" "}
                    <span className="font-semibold text-gray-800 ">
                      {blog.description.split(" ").slice(0,10).join(" ")}...
                    </span>
                  </p>
                  <button className="bg-teal-600 hover:bg-teal-700 p-2 rounded-lg text-white mb-2">
                    View more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  export default HomePage;
