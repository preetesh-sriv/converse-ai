import { Outlet, useNavigate} from 'react-router-dom'
import './dashboardLayout.css'
import { useAuth } from "@clerk/clerk-react"
import { useEffect } from 'react';
import ChatList from '../../components/chatList/ChatList';

const DashboardLayout = () => {
  const {userId , isLoaded} = useAuth();
  const navigate = useNavigate()
  // he useNavigate hook is a part of React Router (v6 and above) and is used for navigating programmatically in your React application.
  useEffect(()=>{
    console.log("Auth Loaded:", isLoaded, "UserID:", userId);  // Debugging output
    if(isLoaded && !userId){
      console.log("Redirecting to sign-in...");  // More debugging output
      navigate("/sign-in")
    }
  },[isLoaded,userId,navigate]);

  if(!isLoaded) return "Loading...";
  return (
    <div className='dashboardLayout'>
        <div className='menu'><ChatList/></div>
        <div className='content'>
            <Outlet/>
        </div>
    </div>
  )
}

export default DashboardLayout;