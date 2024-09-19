import { FaDollarSign, FaShoppingCart, FaSitemap, FaUsers } from "react-icons/fa";
import "flowbite";
import { HiFilm, HiHome } from "react-icons/hi2";
import { MdDashboard } from "react-icons/md";
import { AiFillCrown, AiFillProduct } from "react-icons/ai";
import { NavLink } from "react-router-dom";
const CMSSidebar = () => {
  const adminMenu = [
    {
      name:"Home",
      url:"/",
      icon: <HiHome className="w-6 h-4 mr-4"/>
    },
    {
      name:"Dashboard",
      url:"/admin",
      icon: <MdDashboard className="w-6 h-4 mr-4"/>
    },
    {
      name:"Banner Management",
      url:"/admin/banner",
      icon: <HiFilm className="w-6 h-4 mr-4"/> 
    },
    {
      name:"Product Management",
      url:"/admin/product",
      icon: <AiFillProduct className="w-6 h-4 mr-4"/>
    },
    {
      name:"Category Management",
      url:"/admin/category",
      icon: <FaSitemap className="w-6 h-4 mr-4"/>
    },
    {
      name:"Brand Management",
      url:"/admin/brand",
      icon: <AiFillCrown className="w-6 h-4 mr-4"/> 
    },
    {
      name:"User Management",
      url:"/admin/users",
      icon: <FaUsers className="w-6 h-4 mr-4"/>
    },
    {
      name:"Order Management",
      url:"/admin/orders",
      icon: <FaShoppingCart className="w-6 h-4 mr-4"/>
    },
    {
      name:"Transaction Management",
      url:"/admin/transactions",
      icon: <FaDollarSign className="w-6 h-4 mr-4"/>
    }
  ]
  return (
    <>
      <aside
        className="fixed top-0 left-0 z-100 pt-20 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="drawer-navigation"
        id="drawer-navigation"
      >
        <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
          <ul className="space-y-2">
            {
              adminMenu.map((item: any, i:number) => (
                
                <li key={i}>
                  <NavLink
                    to={item.url}
                    className="flex items-center p-2  w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                   {item.icon} {item.name}
                   </NavLink>
                </li>
              ))
            }
          </ul>
        </div>
      </aside>
    </>
  );
};
export default CMSSidebar;
