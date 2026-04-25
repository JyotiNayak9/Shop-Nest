import logo from "../../../assets/images/logo.png";
import "flowbite";
import { HiBars4 } from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../../context/auth.context";
export const AdminHeader = () => {
  const { LoggedInUser } = useContext(AuthContext);
  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4  dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0  z-50">
        <div className="flex flex-wrap justify-between items-center">
            <button
              data-drawer-target="drawer-navigation"
              data-drawer-toggle="drawer-navigation"
              aria-controls="drawer-navigation"
              className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <HiBars4 className="w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </button>
            <NavLink
              to="/"
              className="flex items-center justify-between mr-4"
            >
              <img
                src={logo}
                className="ml-20 h-10 sm:h-10 w-30 lg:h-20 xl:h-20"
                alt=" Logo"
              />
            </NavLink>
           
           <div className="flex justify-center md:order-2  mr-10">
             
                <NavLink
                  to={"/" + LoggedInUser.role}
                  className={({ isActive }: { isActive: boolean }) =>
                    isActive
                      ? "md:text-blue-600"
                      : "md:text-gray-700" +
                        "  md:bg-transparent md:text-gray-700  md:p-0 dark:text-white md:dark:text-blue-500"
                  }
                >
                  {LoggedInUser.name}
                </NavLink>
                <NavLink 
                  to="/logout"
                  className={({ isActive }: { isActive: boolean }) =>
                    isActive
                      ? "md:text-blue-600"
                      : "md:text-gray-700" +
                        "block py-2 px-3 ml-4  text-white bg-gray-400 rounded md:bg-transparent md:text-gray-700  md:p-0 dark:text-white md:dark:text-blue-500"
                  }
                >
                  Logout
                </NavLink>
             </div>
              
          </div>
      </nav>
    </>
  );
};
