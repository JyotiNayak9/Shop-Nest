import { useContext} from "react"
import AuthContext from "../context/auth.context"
import { toast } from "react-toastify"
import { Navigate } from "react-router-dom"


type PermissionType = {

    allowedBy : string,
    children: any
}
const CheckPermission = ({allowedBy, children}: PermissionType) => {
  
    const {LoggedInUser} = useContext(AuthContext)
    
    // If user is not logged in
    if(!LoggedInUser) {
        console.log("User not logged in")
        toast.error("Please login first");
        return <Navigate to={'/login'}/>
    }
    
    // If user is logged in but doesn't have the required role
    if(LoggedInUser.role !== allowedBy) {
        toast.warn("You do not have permission to access this panel.")
        return <Navigate to={'/' + LoggedInUser.role}/>
    }
    
    // User has the required role
    return children
}
export default CheckPermission