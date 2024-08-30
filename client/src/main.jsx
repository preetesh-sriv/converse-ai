import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import Homepage from "./routes/homepage/Homepage";
import DashboardPage from "./routes/dashBoardPage/DashboardPage";
import ChatPage from "./routes/chatPage/ChatPage";
import RootLayout from "./layouts/rootLayout/RootLayout";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";
import SignUpPage from "./routes/signUpPage/SignUpPage";
import SignInPage from "./routes/signInPage/SignInPage";

const router = createBrowserRouter([
{
  element: <RootLayout/>,
  children:[
    {
      path: "/",
      element: <Homepage/>,
    },
    {
      path: "/sign-in/*",
      // Above line means sign in and every children of this page
      element: <SignInPage/>,
    },
    {
      path: "/sign-up/*",
      element: <SignUpPage/>,
    },
    {
      element: <DashboardLayout/>,
      children: [
        {
          path: '/dashboard',
          element: <DashboardPage/>
        },
        {
          path: '/dashboard/chats/:id',
          element: <ChatPage/>
        }
      ]
    }
  ],
},
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} /> {/* llama coder write something here */}
  </React.StrictMode>
);