import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/auth.context"
import { toast } from "react-toastify"
import { Navigate } from "react-router-dom"


type PermissionType = {

    allowedBy : string,
    children: any
}
const CheckPermission = ({allowedBy, children}: PermissionType) => {
  
    const {LoggedInUser} = useContext(AuthContext)
    if(LoggedInUser) {
            if(LoggedInUser.role === allowedBy){
                return children
            } else{
                toast.warn("You do not have permission to access this panel.")
                return(
                    <>
                    <Navigate to={'/' + LoggedInUser.role}/>
                    </>
                )
            }
    } else{
        console.log("I am here")
       toast.error("Please login first");
        return(
            <>
            <Navigate to={'/login'}/>
            </>
        )
    }
}
export default CheckPermission