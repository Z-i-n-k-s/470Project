import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Adminlog from './loginpages/Adminlog';
import Studentlog from './loginpages/Studentlog';
import Teacherlog from './loginpages/Teacherlog';
import Login from './login/Login';
import Admindash from './dashboard/Admindash';
import Studentdash from './dashboard/Studentdash';
import Teacherdash from './dashboard/Teacherdash';
import Studentreg from './register/Studentreg';
import Teacherreg from './register/Teacherreg';
import Courses from './courses/Courses';
function App  (){
  const [userRole, setUserRole] = useState('');

  // Create a dynamic router based on user role
  const router = createBrowserRouter([
    {path:'/',element:<><Login/></>},
    {path:'/studentlog',element:<><Studentlog/></>},
    {path:'/teacherlog',element:<><Teacherlog/></>},
    {path:'/adminlog',element:<><Adminlog/></>},
    {path:'/admindash',element:<><Admindash/></>},
    {path:'/teacherdash',element:<><Teacherdash/></>},
    {path:'/studentdash',element:<><Studentdash/></>},
    {path:'/studentreg',element:<><Studentreg/></>},
    {path:"/course/:courseName", element: <Courses />},
    {path:'/teacherreg',element:<><Teacherreg/></>}
  ]);

  return (<><RouterProvider router={router} /></>) ;
};

export default App
