import React, { useState } from "react";
import Navbar from "../user/Navbar";
import axiosInstance from "../../constraints/axios/userAxios";
import { blogEndpoints } from "../../constraints/endpoints/blogEnpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import {  IBlogData } from "../../interface/IBlog";

const AddBlog = () => {
  const navigate = useNavigate()
  const userId = useSelector((state:RootState)=>state.user.user?.id)
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<IBlogData>({
    title: "",
    category: "",
    description: "",
    userId:'',
    image: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if(file.size>10*1024*1024){
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('========', formData);
      formData.userId=userId ||''
      const response = await axiosInstance.post(blogEndpoints.addBlog, formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        toast.success(response.data.message)
        navigate('/home')
      }
      console.log("Form Data:", formData);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-center p-6 border-b">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Add a New Blog</h1>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image Upload Section */}
              <div className="w-full lg:w-1/2">
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
                  ) : (
                    <div className="text-center p-4 md:p-6">
                      <div className="text-3xl md:text-4xl mb-2">📸</div>
                      <p className="text-gray-500 text-sm md:text-base">Click to upload blog cover image</p>
                      <p className="text-xs md:text-sm text-gray-400">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
              </div>

              {/* Form Fields */}
              <div className="w-full lg:w-1/2 space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Blog Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter blog title"
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
                    placeholder="Enter blog description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
            >
              Submit Blog
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBlog;