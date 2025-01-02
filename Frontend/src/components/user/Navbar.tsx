import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slice/UserSlice";
import { RootState } from "../../redux/store/store";
const Navbar = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.user);
  const username = user?.username;
  const avatar = user?.avatar
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleMouseOver = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };
  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    dispatch(logout())
    navigate('/')
  }
  return (
    <nav className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* App Name */}
          <div className="text-lg font-bold">
            <a href="/" className="hover:text-green-300">
              MyApp
            </a>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link
              to="/profile"
              className="text-sm font-medium hover:text-green-300"
            >
              Profile
            </Link>
            <Link
              to="/home"
              className="text-sm font-medium hover:text-green-300"
            >
              Home
            </Link>
            <Link
              to="/add-blog"
              className="text-sm font-medium hover:text-green-300"
            >
              Add Blog
            </Link>
          </div>
          {/* Profile Image */}
          <div
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            className="hidden relative md:flex items-center space-x-4  -mr-8"
          >
            <img
              src={avatar || `https://ui-avatars.com/api/?name=${username}` || 'Guest'}
              alt="Profile"
              className="h-10 w-10 rounded-full border-2 border-white object-cover "
            />
            {open && (
              <div className="absolute right-0  mt-36 bg-white shadow-xl rounded-lg p-2 w-44 z-20 ">
                <div className="flex flex-col gap-3">
                  {/* Profile Option */}
                  <Link
                    to="/profile"
                    className="flex items-center text-gray-800 hover:text-blue-600 transition duration-200 font-medium py-2 px-3 rounded-md hover:bg-blue-50"
                  >
                    <FaUserCircle className="text-xl mr-2" />
                    Profile
                  </Link>
                  <hr className="border-t border-gray-300" />
                  {/* Logout Option */}
                  <div
                    onClick={handleLogout}
                    className="flex items-center text-gray-800 hover:text-red-600 transition duration-200 font-medium py-2 px-3 rounded-md hover:bg-red-50 cursor-pointer"
                  >
                    <MdLogout className="text-xl mr-2" />
                    LogOut
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white font-semibold">
              {isMenuOpen ? "Close Menu" : "Open Menu"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-green-600">
          <a
            href="/profile"
            className="block px-4 py-2 text-sm hover:bg-green-700"
          >
            Profile
          </a>
          <a
            href="/home"
            className="block px-4 py-2 text-sm hover:bg-green-700"
          >
            Home
          </a>
          <a
            href="/add-blog"
            className="block px-4 py-2 text-sm hover:bg-green-700"
          >
            Add Blog
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
