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
import Unilist from './Unilist/Unilist';
import Countrycom from './Unilist/Countrycom';

import Teacheronline from './onlineclass/Teacheronline';
import Studentonline from './onlineclass/Studentonline';
import StudentProfileEdit from './ProfileEdit/StudentProfileEdit';
import TeacherProfileEdit from './ProfileEdit/TeacherProfileEdit';
import CreateQuiz from './teacherQuiz/CreateQuiz';
import TakeQuiz from './studentQuiz/TakeQuiz';
import CreateAssignment from './teacherAssignment/CreateAssignment';
import SubmitAssignment from './studentAssignment/SubmitAssignment';
import AssignmentFeedback from './TeacherAssignmentFeedback/AssignmentFeedback';
import StudentAssignmentFeedback from './studentAssignmentFeedback/StudentAssignmentFeedback';
import Logout from './logout/Logout';
import TeacherInfo from './details/TeacherInfo';
import StudentInfo from './details/StudentInfo';
import CreateAds from './ads/CreateAds';
import Certificate from './certificates/Certificate';
import Recordedclass from './recordedclass/RecordedClass';
import ViewRecord from './viewrecord/ViewRecord';
function App  (){
  const [userRole, setUserRole] = useState('');

  // Create a dynamic router based on user role
  const router = createBrowserRouter([
    {path:'/',element:<><Login/></>},
    {path:'/logout',element:<><Logout/></>},
    {path:'/studentlog',element:<><Studentlog/></>},
    {path:'/teacherlog',element:<><Teacherlog/></>},
    {path:'/adminlog',element:<><Adminlog/></>},
    {path:'/admindash',element:<><Admindash/></>},
    {path:'/createads',element:<><CreateAds/></>},
    {path:'/teacherdash',element:<><Teacherdash/></>},
    {path:'/studentdash',element:<><Studentdash/></>},
    {path:'/cretificate',element:<><Certificate/></>},
    {path:'/studentreg',element:<><Studentreg/></>},
    {path:'/takequiz',element:<><TakeQuiz/></>},
    {path:'/createassignment',element:<><CreateAssignment/></>},
    {path:'/submitassignment',element:<><SubmitAssignment/></>},
    {path:'/assignmentfeedback',element:<><AssignmentFeedback/></>},
    {path:'/studentassignmentfeedback',element:<><StudentAssignmentFeedback/></>},
   { path:'/teacher/:teacherId', element:<><TeacherInfo/></>},
   { path:'/student/:studentId', element:<><StudentInfo/></>},
    {path:'/teacherreg',element:<><Teacherreg/></>},
    {path:'/createQuiz',element:<><CreateQuiz/></>},
    {path:"/course/:courseName/:returnto", element: <Courses />},
    {path:"/countrycom", element: <Countrycom />},
    {path:"/recordedclass", element: <Recordedclass />},
    {path:"/viewrecordedclass", element: <ViewRecord />},
    {path:"/teacheronline", element: <Teacheronline />},
    {path:"/studentonline", element: <Studentonline />},
    {path:'/unilist',element:<><Unilist/></>},
    {path:'/teacherprofileedit',element:<><TeacherProfileEdit/></>},
    {path:'/studentprofileedit',element:<><StudentProfileEdit /></>}
  ]);

  return (<><RouterProvider router={router} /></>) ;
};

export default App
