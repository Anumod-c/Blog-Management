import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import PrivateRoute from "./routes/Private";
import PublicRoute from "./routes/Public";
import Register from "./components/auth/Register";
import Home from "./pages/Home";
import Profile from "./components/user/Profile";
import SingleBlog from "./components/blog/SingleBlog";
import AddBlog from "./components/blog/AddBlog";
import UpdateBlog from "./components/blog/UpdateBlog";
import UpdateProfile from "./components/user/UpdateProfile";
import EmailVerification from "./components/auth/EmailVerification";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<PublicRoute/>}>
          <Route path="/" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/email-verification/:id" element={<EmailVerification />}></Route>
        </Route> 

        <Route element={<PrivateRoute/>}>
          <Route path="/home" element={<Home/>}></Route>
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/edit-profile" element={<UpdateProfile/>}></Route>
          
          <Route path="/singleBlog" element={<SingleBlog/>}></Route>
          <Route path="/add-blog" element={<AddBlog/>}></Route>
          <Route path="/edit-blog" element={<UpdateBlog/>}></Route>


        </Route>        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
