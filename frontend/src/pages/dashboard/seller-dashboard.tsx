import { Card } from "flowbite-react";
import { HiCash, HiCurrencyDollar, HiShoppingCart, HiUserGroup } from "react-icons/hi";
import authSvc from "../auth/auth.service";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth.context";

const SellerDashboard = () => {
const [ProductsCount, setProductsCount] = useState<number>(0);
const [SellerCount, setSellerCount] = useState<number>(0);
const [OrderCount, setOrderCount] = useState<number>(0);
const {LoggedInUser} = useContext(AuthContext)
// const [] 
 const totalUsers = async() => {
  try{
   
        const response: any = await authSvc.getRequest("/product/getProductBySeller/"+LoggedInUser._id, {auth:true})
        setProductsCount(response.meta.total);
        const res:any = await authSvc.getRequest('order/getOrdersBySeller/'+LoggedInUser._id, {auth:true});
        setOrderCount(res.meta.total);
  }catch(exception){
            toast.error("Error while fetching details")
            
            console.log(exception)
          }
  } 
  
 useEffect(() => {
  totalUsers()
 }, []);
    return(
        <>
         <div className=" mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Card  className="max-w-sm bg-violet-600 hover:bg-violet-800" >
      <h5 className="text-2xl font-bold tracking-tight text-white dark:text-white">
        <HiUserGroup/>
        Total Products
      </h5>
      <p className="font-bold text-white dark:text-gray-400">
       {ProductsCount}
      </p>
    </Card>
    {/* <Card  className="max-w-sm bg-violet-600 hover:bg-violet-800" >
      <h5 className="text-2xl font-bold tracking-tight text-white dark:text-white">
        <HiUserGroup/>
        Total Vendors
      </h5>
      <p className="font-bold text-white dark:text-gray-400">
       {SellerCount}
      </p>
    </Card> */}

           <Card  className="max-w-sm bg-yellow-500 hover:bg-yellow-700" >
      <h5 className="text-2xl font-bold tracking-tight text-white dark:text-white">
        <HiShoppingCart/>
        Total Orders
      </h5>
      <p className="font-bold text-white dark:text-gray-400">
       {OrderCount}
      </p>
    </Card>
           {/* <Card href="#" className="max-w-sm bg-red-600 hover:bg-red-800" >
      <h5 className="text-2xl font-bold tracking-tight text-white dark:text-white">
        <HiCash/>
        Total Sales
      </h5>
      <p className="font-bold text-white dark:text-gray-400">
       1000
      </p>
    </Card>
           <Card href="#" className="max-w-sm bg-green-500 hover:bg-green-700" >
      <h5 className="text-2xl font-bold tracking-tight text-white dark:text-white">
        <HiCurrencyDollar/>
        Total Revenue
      </h5>
      <p className="font-bold text-white dark:text-gray-400">
       1000
      </p>
    </Card>          */}
     </div>
          </>
    )
}
export default SellerDashboard;