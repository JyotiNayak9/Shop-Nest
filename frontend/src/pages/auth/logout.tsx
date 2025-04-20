import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../../context/auth.context";
import { useContext } from "react";
import { set } from "react-hook-form";

const Logout = () => {
    const navigate = useNavigate();
    let {LoggedInUser, setLoggedInUser} = useContext(AuthContext)
    const didLogout = useRef(false);


    useEffect(() => {
        if (didLogout.current) return; 
        didLogout.current = true;
        localStorage.removeItem("_at");
        localStorage.removeItem("_rt");
        setLoggedInUser(null);
        toast.info("You are logged out.");
        navigate("/");      
    }, [navigate,setLoggedInUser]);

    return null;
};

export default Logout;