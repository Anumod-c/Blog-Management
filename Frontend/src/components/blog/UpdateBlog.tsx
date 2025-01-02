import React, { useEffect, useState } from "react";
import Navbar from "../user/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../constraints/axios/userAxios";
import { blogEndpoints } from "../../constraints/endpoints/blogEnpoints";
import { IBlog } from "../../interface/IBlog";
import { toast } from "react-toastify";

const UpdateBlog = () => {
  const blogId = useLocation();
  console.log('blogId updte', blogId.state)
  const navigate = useNavigate()
  interface Errors {
    title?: string;
    category?: string;
    description?: string;
    image?: string;
  }


  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [blog, setBlog] = useState<IBlog | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: null as string | File | null,
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement| HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.info("Image size should be less than 10Mb");
        return
      }
      setFormData({ ...formData, image: file });
      setErrors({ ...errors, image: "" });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    document.getElementById('fileInput')?.click();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = "Title is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.description || formData.description.length < 10)
      newErrors.description = "Description must be at least 10 characters long.";
    if (!formData.image) newErrors.image = "A cover image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  useEffect(() => {
    const fetchBLog = async () => {
      console.log('working edit')
      try {
        const response = await axiosInstance.get(`${blogEndpoints.singleblog}/${blogId.state}`);
        console.log('working edit', response.data)

        if (response.status == 200) {
          setBlog(response.data.result.result)
        }
      } catch (error) {
        console.log('Error in fetching single blog for editng blog', error)
      }
    }
    fetchBLog();

  }, [blogId])
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        category: blog.category,
        description: blog.description,
        image: blog.image,
      });
    }
  }, [blog]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axiosInstance.put(`${blogEndpoints.updateBlog}/${blogId.state}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status == 200) {
          navigate('/profile');
          toast.success(response.data.message)
        }
      } catch (error) {
        console.log('Error in updating blog details', error)
      }
      console.log("Form Data:", formData);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <form onSubmit={handleSubmit} className="w-3/4 bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex items-center justify-center p-2 mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Edit Blog</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload Section */}
            <div className="w-full">
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div
                onClick={triggerFileInput}
                className={`w-full aspect-video rounded-lg border-2 border-dashed cursor-pointer flex items-center justify-center ${imagePreview ? 'border-transparent' : 'border-gray-300 hover:border-blue-500'
                  }`}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : blog?.image ? (
                  <img
                    src={blog?.image}
                    alt="Existing"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center p-6">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-gray-500">Click to upload blog cover image</p>
                    <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Blog Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>


              <div>
                  <label className="block text-gray-700 font-medium mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    <option value="technology">Technology</option>
                    <option value="Adventure">Adventure</option>
                    <option value="business">Business</option>
                    <option value="health">Health</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full  py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Submit Blog
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateBlog;