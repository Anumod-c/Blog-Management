import Cookies from 'js-cookie'
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute:React.FC=()=>{
    const token  = Cookies.get('token');
    const refreshToken = Cookies.get('refreshToken');
    return token||refreshToken?<Outlet/>: <Navigate to={"/"}/>
}

export default PrivateRoute