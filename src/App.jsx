import React from "react"
import { BrowserRouter,Routes,Route } from "react-router-dom"
import Layout from "../components/Layout"
import Header from "../components/Header"
import Home from "../components/home"
import Profile from "../components/Profile"
import Register from "../components/Register"
import Login from "../components/Login"
import Authrequired from "../components/Authrequired"
import ShowPost from "../components/ShowPost"
import Userprofile from "../components/Userprofile"




function App() {
  return (
   <BrowserRouter>
   <Routes>

    <Route path="/" element={<Layout/>}>
    <Route index element={<Home/>}/>
    <Route path=":id" element={<ShowPost/>} />
    <Route  element={<Authrequired/>} >
    <Route path="profile" index element={<Profile/>}/>
    <Route path="userprofile/:id" element={<Userprofile/>}/>
    </Route>
    
    <Route path="login" element={<Login/>} />
    <Route path="register" element={<Register/>} />
    
    

    
    </Route>

    
   </Routes>
   
   
   </BrowserRouter>
  )
}

export default App
