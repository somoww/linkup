import React from 'react'
import { Navigate ,Outlet} from 'react-router-dom'

export default function Authrequired() {
 if(localStorage.getItem("token")){
   return( <Outlet/>)
 }
 else{
    return(
        <Navigate state={"you must log in first"} to="/login"/>
    )

 }
}
