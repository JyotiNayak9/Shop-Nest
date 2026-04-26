import { Navbar, Dropdown } from "flowbite-react";
import logo from "../../../assets/images/logo.png";
import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../../context/auth.context";
import { FaCartPlus, FaUser,  FaBars, FaTimes } from "react-icons/fa";

export const HomeHeader = () => {
  const { LoggedInUser }: any = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      <Navbar fluid className="shadow-lg bg-white border-b border-gray-200">
        <div className="flex items-center justify-between w-full px-4">
          {/* Logo */}
          <Navbar.Brand href="/" className="flex items-center">
            <img 
              src={logo} 
              className="h-12 sm:h-14 lg:h-16 w-auto" 
              alt="ShopNest Logo" 
            />
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-violet-600 ${
                  isActive ? "text-violet-600" : "text-gray-700"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-violet-600 ${
                  isActive ? "text-violet-600" : "text-gray-700"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-violet-600 ${
                  isActive ? "text-violet-600" : "text-gray-700"
                }`
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/SellerRegister"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-violet-600 ${
                  isActive ? "text-violet-600" : "text-gray-700"
                }`
              }
            >
              Become a Vendor
            </NavLink>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {LoggedInUser ? (
              <>
                {LoggedInUser.role === "customer" && (
                  <NavLink
                    to="/cart"
                    className="relative p-2 text-gray-700 hover:text-violet-600 transition-colors"
                  >
                    <FaCartPlus className="text-xl" />
                  </NavLink>
                )}
                
                {/* Desktop User Menu */}
                <div className="hidden md:block">
                  <Dropdown
                    label={LoggedInUser.name}
                    placement="bottom-end"
                    className="border-violet-200"
                  >
                    <Dropdown.Item>
                      <NavLink
                        to={LoggedInUser.role === "customer" ? "/orderhistory" : "/" + LoggedInUser.role}
                        className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {LoggedInUser.role === "customer" ? "Order History" : "Dashboard"}
                      </NavLink>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <NavLink
                        to="/logout"
                        className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </NavLink>
                    </Dropdown.Item>
                  </Dropdown>
                </div>

                {/* Mobile User Menu */}
                <div className="md:hidden">
                  <Dropdown
                    label={<FaUser className="text-xl text-gray-700" />}
                    placement="bottom-end"
                    
                  >
                    <Dropdown.Item>
                      <NavLink
                        to={LoggedInUser.role === "customer" ? "/orderhistory" : "/" + LoggedInUser.role}
                        className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {LoggedInUser.role === "customer" ? "Order History" : "Dashboard"}
                      </NavLink>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <NavLink
                        to="/logout"
                        className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </NavLink>
                    </Dropdown.Item>
                  </Dropdown>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Register
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-violet-600 transition-colors"
            >
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 text-sm font-medium transition-colors ${
                    isActive ? "text-violet-600" : "text-gray-700"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 text-sm font-medium transition-colors ${
                    isActive ? "text-violet-600" : "text-gray-700"
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 text-sm font-medium transition-colors ${
                    isActive ? "text-violet-600" : "text-gray-700"
                  }`
                }
              >
                Contact
              </NavLink>
              <NavLink
                to="/SellerRegister"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 text-sm font-medium transition-colors ${
                    isActive ? "text-violet-600" : "text-gray-700"
                  }`
                }
              >
                Become a Vendor
              </NavLink>
              
              {!LoggedInUser && (
                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <NavLink
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full py-2 px-4 text-center text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full py-2 px-4 text-center text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </Navbar>
    </>
  );
};
