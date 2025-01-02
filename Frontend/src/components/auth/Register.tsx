import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IRegisterationData } from "../../interface/IAuth";
import axios from "axios";
import { userEndpoints } from "../../constraints/endpoints/userEnpoints";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
      password: Yup.string()
      .matches(/[A-Z]/, "Password must have at least one uppercase letter")
      .matches(/[0-9]/, "Password must have at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must have at least one special character")
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values: IRegisterationData) => {
    try {
      console.log('registeration values',values)
      const response = await axios.post(userEndpoints.register,values)
      if (response.status==200) {
       toast.success(response.data.message);
       navigate('/')
      }else if (response.status==400) {
        console.log('hyyyyyy')
        toast.success(response.data.message);
        navigate('/')
       } 
    } catch (error) {
      console.error(error, "registration error");
      toast.error("An unexpected error occured. Please try again later.")

    }
  };

  return (
    <div className="flex items-center h-screen justify-center w-full">
      {/* Left side: Hidden on small screens */}
      <div className="hidden md:flex text-7xl justify-center items-center h-screen bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold w-1/2">
        REGISTER PAGE
      </div>
      {/* Right side: Registration form */}
      <div className="w-full md:w-1/2 h-screen flex justify-center items-center bg-gray-100">
        <Formik
          initialValues={{
            username: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="border bg-white shadow-lg p-4 w-2/3">
              <div className="flex justify-center items-center p-2 m-2 text-2xl font-bold">
                <h1>REGISTER PAGE</h1>
              </div>
              <div className="flex flex-col mb-2">
                <label className="font-semibold text-sm">Name:</label>
                <Field
                  type="text"
                  name="username"
                  className="border w-full p-2 rounded-md shadow-md"
                  placeholder="Full Name"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex flex-col mb-2">
                <label className="font-semibold text-sm">Email:</label>
                <Field
                  type="email"
                  name="email"
                  className="border w-full p-2 rounded-md shadow-md"
                  placeholder="Email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex flex-col mb-2">
                <label className="font-semibold text-sm">Phone:</label>
                <Field
                  type="text"
                  name="phone"
                  className="border w-full p-2 rounded-md shadow-md"
                  placeholder="Phone"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex flex-col mb-2">
                <label className="font-semibold text-sm">Password:</label>
                <Field
                  type="password"
                  name="password"
                  className="border w-full p-2 rounded-md shadow-md"
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex flex-col mb-2">
                <label className="font-semibold text-sm">
                  Confirm Password:
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="border w-full p-2 rounded-md shadow-md"
                  placeholder="Confirm Password"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="bg-green-500 rounded-md w-full text-white p-3 m-2 shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </button>
              </div>
              <p className="p-2">
                Already have an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
