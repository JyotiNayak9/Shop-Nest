import logo from "../../../assets/images/logo.png";
import "flowbite";
import {  HiX, HiUser, HiLogout } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../../context/auth.context";
import { Dropdown } from "flowbite-react";
import { HiBars4 } from "react-icons/hi2";
export const AdminHeader = () => {
  const { LoggedInUser } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button and Logo */}
            <div className="flex items-center">
              <button
                data-drawer-target="drawer-navigation"
                data-drawer-toggle="drawer-navigation"
                aria-controls="drawer-navigation"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <HiX className="w-5 h-5" /> : <HiBars4 className="w-5 h-5" />}
                <span className="sr-only">Toggle sidebar</span>
              </button>
              
              <NavLink
                to="/"
                className="flex items-center"
              >
                <img
                  src={logo}
                  className="h-8 sm:h-10 lg:h-12 w-auto"
                  alt="ShopNest Logo"
                />
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              
              
              <Dropdown
                label={LoggedInUser.name}
                placement="bottom-end"
                arrowIcon={false}
                className="border-violet-200"
              >
                <Dropdown.Item>
                  <div className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700">
                    <HiUser className="w-4 h-4" />
                    <span>{LoggedInUser.name}</span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <NavLink
                    to="/logout"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <HiLogout className="w-4 h-4" />
                    <span>Logout</span>
                  </NavLink>
                </Dropdown.Item>
              </Dropdown>
            </div>

            {/* Mobile User Menu */}
            <div className="lg:hidden">
              <Dropdown
                label={<HiUser className="w-5 h-5 text-gray-700" />}
                placement="bottom-end"
                arrowIcon={false}
              >
                <Dropdown.Item>
                  <div className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700">
                    <HiUser className="w-4 h-4" />
                    <span>{LoggedInUser.name}</span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <NavLink
                    to={"/" + LoggedInUser.role}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <span>Dashboard</span>
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item>
                  <NavLink
                    to="/logout"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <HiLogout className="w-4 h-4" />
                    <span>Logout</span>
                  </NavLink>
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 bg-white">
              <div className="px-4 py-3 space-y-1">
                <NavLink
                  to={"/" + LoggedInUser.role}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-violet-600 bg-violet-50"
                        : "text-gray-700 hover:text-violet-600 hover:bg-gray-50"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/logout"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-violet-600 hover:bg-gray-50 transition-colors"
                >
                  <HiLogout className="w-4 h-4" />
                  <span>Logout</span>
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
