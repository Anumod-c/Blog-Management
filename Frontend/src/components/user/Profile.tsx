import { useNavigate } from 'react-router-dom';
import { useState, ChangeEvent, useEffect } from 'react';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import axiosInstance from '../../constraints/axios/userAxios';
import { blogEndpoints } from '../../constraints/endpoints/blogEnpoints';
import { IBlog } from '../../interface/IBlog';
import { toast } from 'react-toastify';

function Profile() {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user)
    const [showModal, setShowModal] = useState<boolean>(false);
    const [userBlogs, setUserBlogs] = useState<IBlog[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false); // For delete confirmation modal
    const [blogToDelete, setBlogToDelete] = useState<string | null>(null); // Store blog ID to delete
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState<string>('');

    const handleBlogClick = (blogId: string): void => {
        navigate(`/singleBlog/${blogId}`);
    };

    // const handleResetPassword = (): void => {
    //     setShowModal(true);
    // };
    const handleEditProfile = (): void => {
        navigate('/edit-profile')
    }
    useEffect(() => {
        const fetchUserBlog = async () => {
            try {
                const response = await axiosInstance.get(`${blogEndpoints.fetchUserBLogs}/${user?.id}`);
                if (response.status === 200) {
                    setUserBlogs(response.data.blogs);
                }
            } catch (error) {
                toast.error('Error fetching blogs. Please try again.');
                console.log('Error fetching blogs. Please try again.', error)
            }
        };
        fetchUserBlog();
    }, [user?.id]);

    const handleDeleteClick = (blogId: string): void => {
        setBlogToDelete(blogId); // Set the blog ID to be deleted
        setShowDeleteModal(true); // Show confirmation modal
    };
    const deleteBlog = async () => {
        if (!blogToDelete) return;

        try {
            const response = await axiosInstance.delete(`${blogEndpoints.deleteBlog}/${blogToDelete}`);
            if (response.status === 200) {
                toast.success('Blog deleted successfully!');
                setUserBlogs((prev)=>prev.filter(blog=>blog._id!==blogToDelete))
                setShowDeleteModal(false); // Hide the modal after deletion
                navigate('/profile'); // Navigate back to the profile page
            }
        } catch (error) {
            toast.error('Failed to delete the blog. Please try again.');
            console.log('Error deleting blog:', error);
        }
    };

    const handleCloseDeleteModal = (): void => {
        setShowDeleteModal(false);
        setBlogToDelete(null);
    };
    const handleCloseModal = (): void => {
        setShowModal(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setPasswordError('');
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const validatePassword = (): boolean => {
        const { newPassword, confirmPassword } = passwordData;
        const passwordRegex =
            /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[!@#$%^&])[A-Za-z\d!@#$%^&]{8,}$/;

        if (!passwordRegex.test(newPassword)) {
            setPasswordError(
                'Password must contain at least one special character, one number, one uppercase letter, one lowercase letter, and be at least 8 characters long.'
            );
            return false;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('New password and confirmation password must match.');
            return false;
        }

        setPasswordError('');
        return true;
    };

    const handleSubmitPasswordReset = async (): Promise<void> => {
        if (validatePassword()) {
            try {
                const response = await axiosInstance.post('/reset-password', {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                });

                if (response.status === 200) {
                    toast.success("Password reset successfully!");
                    handleCloseModal();
                }
            } catch (error) {
                toast.error("Failed to reset password. Please try again.");
                console.log("Failed to reset password. Please try again.", error)
            }
        }
    };


    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image */}
            <div className="flex justify-center md:justify-start items-center w-full md:w-1/3">
                <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}`}
                    alt="Profile"
                    className="object-cover w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full"
                />
            </div>

            {/* Profile Details */}
            <div className="w-full md:w-2/3">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">{user?.username}</h1>
                <p className="text-gray-700 text-sm sm:text-base mb-4">
                    Web Developer | React Enthusiast | Blogger
                </p>

                {/* About Me Section */}
                <div className="mb-8">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-4">About Me</h2>
                    <p className="text-gray-700">
                        {user?.bio || 'No Bio available'}
                    </p>
                </div>
            </div>
        </div>

        {/* Contact Info and Reset Password Section */}
        <div className="flex flex-col md:flex-row justify-between gap-4 bg-gray-50 p-4 sm:p-6 shadow-md rounded-lg mt-6">
            <div className="flex flex-col">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Contact Info:</h2>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                    <p className="text-gray-700 mt-2">
                        <strong>Email:</strong> {user?.email}
                    </p>
                    <p className="text-gray-700 mt-2">
                        <strong>Phone:</strong> {user?.phone}
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
                <button
                    onClick={handleEditProfile}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition duration-200 w-full sm:w-auto"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    </div>

    {/* User's Blogs Section */}
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg mt-6 p-4 sm:p-6">
        <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 text-center">My Blogs</h2>
        <div className="space-y-4">
            {userBlogs?.length > 0 ? (
                userBlogs.map((blog) => (
                    <div key={blog._id} className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 shadow-lg p-4 rounded-lg space-y-4 sm:space-y-0">
                        <div className="flex-grow">
                            <span
                                onClick={() => handleBlogClick(blog._id)}
                                className="text-base sm:text-lg text-gray-600 hover:underline hover:text-blue-600 cursor-pointer"
                            >
                                {blog.title}
                            </span>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => navigate(`/edit-blog`, { state: blog._id })}
                                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition duration-200"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteClick(blog._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-600 text-center">You haven’t published any blogs yet.</p>
            )}
        </div>
    </div>
</div>


            {/* Password Reset Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reset Password</h2>

                        {/* Password Reset Form */}
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md mt-2"
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md mt-2"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md mt-2"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            {/* Validation Error Message */}
                            {passwordError && (
                                <p className="text-red-500 text-sm mb-4">{passwordError}</p>
                            )}

                            <div className="flex justify-between">
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitPasswordReset}
                                    className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-md "
                                >
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this blog?</h2>
                        <div className="flex justify-between">
                            <button
                                onClick={handleCloseDeleteModal}
                                className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteBlog} // Delete the blog
                                className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile;