
import { Routes, Route } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile'
import Driver from '../pages/Driver'
import Curso from '../pages/Course'
import DashFuncionario from '../pages/DashFuncionarios'
import Company from '../pages/Company'
import Employee from '../pages/Employees'

import Private from './Private'

export default function RoutesApp(){
  return(
    <Routes>
      <Route exact path="/" element={<SignIn/>} />
      <Route exact path="/register" element={<SignUp/>} />
      <Route exact path="/dashboard" element={<Private><Dashboard/></Private>}/>
      <Route exact path="/profile" element={<Private><Profile/></Private>} />
      <Route exact path="/driver" element={<Private><Driver/></Private>} />
      <Route exact path="/course" element={<Private><Curso/></Private>} />
      <Route exact path="/course/:id" element={<Private><Curso/></Private>} />
      <Route exact path="/company" element={<Private><Company/></Private>} />
      <Route exact path="/employee" element={<Private><Employee/></Private>} />
      <Route exact path="/dashfuncionario" element={<Private><DashFuncionario/></Private>} />
      
    </Routes>
  )
}