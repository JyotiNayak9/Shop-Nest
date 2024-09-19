import { Avatar, Dropdown, Navbar } from "flowbite-react";
import logo from "../../../assets/images/logo.png";
import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../context/auth.context";

export const HomeHeader = () => {
  const { LoggedInUser }: any = useContext(AuthContext);
  console.log(LoggedInUser);
  return (
    <>
      <Navbar fluid rounded className=" pb-0 shadow-lg">
        <Navbar.Brand href="">
          <img src={logo} className="ml-20 h-20 sm:h-20 w-30 " alt=" Logo" />
        </Navbar.Brand>
        <div className="flex md:order-2 mr-10">
          <Navbar.Collapse>
            {LoggedInUser ? (
              <>
                <NavLink
                  to={"/" + LoggedInUser.role}
                  className={({ isActive }: { isActive: boolean }) =>
                    isActive
                      ? "md:text-blue-600"
                      : "md:text-gray-700" +
                        "block py-2 px-3  text-white bg-gray-400 rounded md:bg-transparent md:text-gray-700  md:p-0 dark:text-white md:dark:text-blue-500"
                  }
                >
                  {LoggedInUser.name}
                </NavLink>
                <NavLink
                  to="/login"
                  className={({ isActive }: { isActive: boolean }) =>
                    isActive
                      ? "md:text-blue-600"
                      : "md:text-gray-700" +
                        "block py-2 px-3  text-white bg-gray-400 rounded md:bg-transparent md:text-gray-700  md:p-0 dark:text-white md:dark:text-blue-500"
                  }
                >
                  Logout
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/register"
                  className={({ isActive }: { isActive: boolean }) =>
                    isActive
                      ? "md:text-blue-600"
                      : "md:text-gray-700" +
                        "block py-2 px-3  text-white bg-gray-400 rounded md:bg-transparent md:text-gray-700  md:p-0 dark:text-white md:dark:text-blue-500"
                  }
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className={({ isActive }: { isActive: boolean }) =>
                    isActive
                      ? "md:text-blue-600"
                      : "md:text-gray-700" +
                        "block py-2 px-3  text-white bg-gray-400 rounded md:bg-transparent md:text-gray-700  md:p-0 dark:text-white md:dark:text-blue-500"
                  }
                >
                  Login
                </NavLink>
              </>
            )}
          </Navbar.Collapse>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <NavLink
            to="/"
            className={({ isActive }: { isActive: boolean }) =>
              isActive
                ? "md:text-blue-600"
                : "md:text-gray-700" +
                  "block py-2 px-3  text-white bg-gray-400 rounded md:bg-transparent md:text-gray-700  md:p-0 dark:text-white md:dark:text-blue-500"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }: { isActive: boolean }) =>
              isActive
                ? "md:text-blue-600"
                : "md:text-gray-700" +
                  "block py-2 px-3  text-white bg-gray-400 rounded md:bg-transparent md:text-gray-700  md:p-0 dark:text-white md:dark:text-blue-500"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }: { isActive: boolean }) =>
              isActive
                ? "md:text-blue-600"
                : "md:text-gray-700" +
                  "block py-2 px-3  text-white bg-gray-400 rounded md:bg-transparent md:text-gray-700  md:p-0 dark:text-white md:dark:text-blue-500"
            }
          >
            Categories
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }: { isActive: boolean }) =>
              isActive
                ? "md:text-blue-600"
                : "md:text-gray-700" +
                  "block py-2 px-3  text-white bg-gray-400 rounded md:bg-transparent md:text-gray-700  md:p-0 dark:text-white md:dark:text-blue-500"
            }
          >
            All Products
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }: { isActive: boolean }) =>
              isActive
                ? "md:text-blue-600"
                : "md:text-gray-700" +
                  "block py-2 px-3  text-white bg-gray-400 rounded md:bg-transparent md:text-gray-700  md:p-0 dark:text-white md:dark:text-blue-500"
            }
          >
            Contact
          </NavLink>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};
