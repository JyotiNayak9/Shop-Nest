import { Card } from "flowbite-react";
import { HiCash, HiCurrencyDollar, HiShoppingCart, HiUserGroup } from "react-icons/hi";

const AdminDashboard = () => {
    return(
        <>
         <div className=" mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Card href="/admin/user-list" className="max-w-sm bg-violet-600 hover:bg-violet-800" >
      <h5 className="text-2xl font-bold tracking-tight text-white dark:text-white">
        <HiUserGroup/>
        Total Customers
      </h5>
      <p className="font-bold text-white dark:text-gray-400">
       1000
      </p>
    </Card>

           <Card href="/admin/order-list" className="max-w-sm bg-yellow-500 hover:bg-yellow-700" >
      <h5 className="text-2xl font-bold tracking-tight text-white dark:text-white">
        <HiShoppingCart/>
        Total Orders
      </h5>
      <p className="font-bold text-white dark:text-gray-400">
       1000
      </p>
    </Card>
           <Card href="#" className="max-w-sm bg-red-600 hover:bg-red-800" >
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
    </Card>          </div>
          </>
    )
}
export default AdminDashboard;