import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgCloseR } from "react-icons/cg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { userEndpoints } from "../../constraints/endpoints/userEnpoints";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slice/UserSlice";
const Login = () => {
  const dispatch = useDispatch();
  const [openForgotPassword, setOpenForgotPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  // Formik for Login
  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async(values) => {
      console.log("Login Submitted", values);
      const result = await axios.post(userEndpoints.login,values);
      if(result.status==200 && result.data.success){
        console.log("Login result", result.data);
        dispatch(login(result.data.user))
        toast.success(result.data.message)
        Cookies.set('token',result.data.token.accessToken)
        Cookies.set('refreshToken',result.data.token.refreshToken)
        navigate("/home");
      }else{
        toast.info(result.data.message)
        navigate("/");


      }
    },
  });

  // Formik for Forgot Password
  const forgotPasswordFormik = useFormik({
    initialValues: {
      resetEmail: "",
    },
    validationSchema: Yup.object({
      resetEmail: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: (values) => {
      console.log("Password reset email sent to", values.resetEmail);
      setOpenForgotPassword(false);
    },
  });

  return (
    <>
      <div className="flex items-center h-screen justify-center w-full">
        <div className="hidden md:flex text-7xl justify-center items-center h-screen bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold w-1/2">
          LOGIN PAGE
        </div>

        <div className="w-full md:w-1/2 h-screen bg-gray-100 flex justify-center items-center">
          <form
            className="border bg-white w-2/3 shadow-lg"
            onSubmit={loginFormik.handleSubmit}
          >
            <div className="flex justify-center items-center p-2 m-2 text-2xl font-bold">
              <h1>LOGIN PAGE</h1>
            </div>
            <div className="flex flex-col gap-2 p-4 m-2">
              <label htmlFor="email" className="font-semibold">
                Email:
              </label>
              <input
                id="email"
                type="text"
                className={`border w-full p-2 rounded-md shadow-md ${
                  loginFormik.touched.email && loginFormik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Email"
                {...loginFormik.getFieldProps("email")}
              />
              {loginFormik.touched.email && loginFormik.errors.email && (
                <p className="text-red-500 text-sm">
                  {loginFormik.errors.email}
                </p>
              )}
            </div>
            <div className="flex relative flex-col gap-2 p-4 m-2">
              <label htmlFor="password" className="font-semibold">
                Password:
              </label>
              <input
                id="password"
                className="border w-full p-2 rounded-md shadow-md"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...loginFormik.getFieldProps("password")}
              />
              <p
                className="absolute text-lg right-3 focus:outline-none top-14 mt-1 mr-4 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? "🙈" : "🙉"}
              </p>
              {loginFormik.touched.password && loginFormik.errors.password && (
                <p className="text-red-500 text-sm">
                  {loginFormik.errors.password}
                </p>
              )}
            </div>
            {/* <div className="p-2 flex justify-end">
              <span
                onClick={() => setOpenForgotPassword(true)}
                className="text-blue-500 cursor-pointer"
              >
                Forgot Password?
              </span>
            </div> */}

            <div className="flex justify-center items-center m-2">
              <button
                className="bg-green-500 rounded-md w-full text-white p-3 m-2 shadow-md"
                type="submit"
              >
                Login
              </button>
            </div>
            <div className="flex justify-center p-2">
              <p className="p-2">
                Don't have an account?
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => navigate("/register")}
                >
                  Register
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>

      {openForgotPassword && (
        <div className="fixed inset-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-lg p-8 relative">
            <button
              onClick={() => setOpenForgotPassword(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition duration-200"
            >
              <CgCloseR size={30} />
            </button>

            <form onSubmit={forgotPasswordFormik.handleSubmit}>
              <div className="flex flex-col w-full gap-6 items-center">
                <h2 className="text-3xl font-bold text-center text-gray-800">
                  Reset Password
                </h2>

                <div className="w-full">
                  <label
                    htmlFor="resetEmail"
                    className="block text-lg font-medium text-gray-700"
                  >
                    Email Address:
                  </label>
                  <input
                    id="resetEmail"
                    type="text"
                    className={`mt-1 block w-full p-3 border ${
                      forgotPasswordFormik.touched.resetEmail &&
                      forgotPasswordFormik.errors.resetEmail
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 ${
                      forgotPasswordFormik.touched.resetEmail &&
                      forgotPasswordFormik.errors.resetEmail
                        ? "focus:ring-red-500"
                        : "focus:ring-blue-500"
                    } transition duration-200`}
                    placeholder="Enter your email address"
                    {...forgotPasswordFormik.getFieldProps("resetEmail")}
                  />
                  {forgotPasswordFormik.touched.resetEmail &&
                    forgotPasswordFormik.errors.resetEmail && (
                      <p className="text-red-500 text-sm mt-2">
                        {forgotPasswordFormik.errors.resetEmail}
                      </p>
                    )}
                </div>

                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg p-3 mt-4 hover:bg-gradient-to-r transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                  type="submit"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
