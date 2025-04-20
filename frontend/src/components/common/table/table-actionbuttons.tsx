import { FaPen, FaTrash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const ActionButtons=({editUrl,deleteAction,rowId}:{editUrl:string, deleteAction:any, rowId:string}) =>{
    const handleDelete = async(e:any)=>{
        e.preventDefault();
        try{
            const result = await Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!"
            })
            if(result.isConfirmed){
                deleteAction(rowId)
    }
}catch(exception){
    console.log(exception)
    toast.error("Error deleting data.")
}
    }
    return(
        <>
        <NavLink to={editUrl} className="font-medium text-xl mr-3 text-violet-700 hover:text-violet-900">
        <FaPen/>
        </NavLink>
        <a 
        onClick={handleDelete}
        href="#" className="font-medium text-xl text-red-600 hover:text-red-900">
        <FaTrash/>
        </a>
        </>
    )
}