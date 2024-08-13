import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from '../pages/SignUp';
import LoginPage from '../pages/Login';
import HomePage from '../pages/Home';
import PrivateRoute from '../components/PrivetRoute';
import Success from '../pages/Success';
import AddPasswordPage from '../pages/AddPasswordPage';

const MainRouter: React.FC = () => (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomePage/>}/>
      <Route path='/success' element ={<Success/>}/>
      <Route path='/signup' element={<Register />}/>
      <Route path='/add-password' element={<AddPasswordPage/>}/>
  </Routes>
);

export default MainRouter;

