import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import Navbar from "./Navbar";
import { userEndpoints } from "../../constraints/endpoints/userEnpoints";
import axiosInstance from "../../constraints/axios/userAxios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { updateAvatar, updateUser } from "../../redux/slice/UserSlice";

interface FormData {
  username: string;
  email: string;
  bio: string;
  phone?:string
  profileImage: string; // Always store a URL or base64 string
}

interface Errors {
  username?: string;
  email?: string;
  bio?: string;
  phone?:string;
  profileImage?: string;
}

const UpdateProfile: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  const [formData, setFormData] = useState<FormData>({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    profileImage: user?.avatar || "", 
    phone:user?.phone||''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(formData.profileImage || null);
  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {

        const response = await axiosInstance.put(userEndpoints.changeAvatar, { profileImage: file, id: user?.id },{
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          toast.success(response.data.message);
          const uploadedImageUrl = response.data.imageUrl; // Assuming backend returns the new image URL
          setFormData((prev) => ({
            ...prev,
            profileImage: uploadedImageUrl,
          }));
          setImagePreview(uploadedImageUrl); // Update preview
          dispatch(updateAvatar(uploadedImageUrl))

        }
      } catch (error) {
        toast.error("Failed to upload image");
        console.log('error in profile update', error)
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.username.trim()) newErrors.username = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[\w-.]+@[\w-]+\.+[\w-]{2,4}$/.test(formData.email))
      newErrors.email = "Invalid email address.";

    if (!formData.bio.trim()) newErrors.bio = "Bio is required.";
    if (!formData.profileImage) newErrors.profileImage = "Profile image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const response = await axiosInstance.put(userEndpoints.updateUser, {
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        phone:formData.phone,
      });
      if (response.status==200) {
        toast.success(response.data.message);
        dispatch(updateUser(formData)); // Update Redux store if needed
        navigate("/profile");
      } else {
        toast.error(response.data.message);
      }
      console.log("Updated profile data:", formData);
      navigate("/profile");
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h1>

          <form onSubmit={handleSubmit}>
            <div className="flex space-x-8 items-center">
              {/* Left Side - Profile Image */}
              <div className="flex flex-col items-center w-1/3">
                <div className="relative group">
                  <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="https://via.placeholder.com/150"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                    <Camera size={20} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {errors.profileImage && (
                  <p className="text-red-500 text-sm mt-2">{errors.profileImage}</p>
                )}
              </div>

              {/* Right Side - Profile Details */}
              <div className="w-2/3 space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-2">{errors.username}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                  disabled
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
                  )}
                </div>
                {/* Bio Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows={2}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm mt-2">{errors.bio}</p>
                  )}
                </div>

                
                
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
