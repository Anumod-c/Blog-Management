import Cookies from 'js-cookie'
import { Navigate, Outlet } from "react-router-dom";


const PublicRoute:React.FC=()=>{
    const token  = Cookies.get('token');
    const refreshToken = Cookies.get('refreshToken');
    return token||refreshToken?<Navigate to={"/home"}/>:<Outlet/>
}

export default PublicRoute