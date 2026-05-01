import { Navbar, Dropdown } from "flowbite-react";
import logo from "../../../assets/images/logo.png";
import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../context/auth.context";
import { FaCartPlus, FaUser, FaBars, FaTimes } from "react-icons/fa";
import authSvc from "../../../pages/auth/auth.service";

export const HomeHeader = () => {
  const { LoggedInUser }: any = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const getGuestCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    return cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        if (LoggedInUser?._id) {
          const response: any = await authSvc.getRequest(
            "/cart",
            { auth: true }
          );
          setCartCount(response.total || 0);
        } else {
          setCartCount(getGuestCartCount());
        }
      } catch (error) {
        console.error("Failed to fetch cart count");
      }
    };

    fetchCartCount();

    window.addEventListener("cartUpdated", fetchCartCount);

    return () => {
      window.removeEventListener("cartUpdated", fetchCartCount);
    };
  }, [LoggedInUser?._id]);

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
            <NavLink to="/" className={({ isActive }) =>
              `text-sm font-medium hover:text-violet-600 ${isActive ? "text-violet-600" : "text-gray-700"}`
            }>
              Home
            </NavLink>

            <NavLink to="/about" className={({ isActive }) =>
              `text-sm font-medium hover:text-violet-600 ${isActive ? "text-violet-600" : "text-gray-700"}`
            }>
              About
            </NavLink>

            <NavLink to="/contact" className={({ isActive }) =>
              `text-sm font-medium hover:text-violet-600 ${isActive ? "text-violet-600" : "text-gray-700"}`
            }>
              Contact
            </NavLink>

            <NavLink to="/SellerRegister" className={({ isActive }) =>
              `text-sm font-medium hover:text-violet-600 ${isActive ? "text-violet-600" : "text-gray-700"}`
            }>
              Become a Vendor
            </NavLink>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {LoggedInUser ? (
              <>
                {LoggedInUser.role === "customer" && (
                  <NavLink to="/cart" className="relative p-2 text-gray-700 hover:text-violet-600">
                    <FaCartPlus className="text-xl" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </NavLink>
                )}

                {/* Desktop Dropdown FIXED */}
                <div className="hidden md:block">
                  <Dropdown
                    label={
                      <span className="px-4 py-2 bg-violet-600 text-white rounded-lg">
                        {LoggedInUser.name}
                      </span>
                    }
                    placement="bottom-end"
                  >
                    <Dropdown.Item>
                      <NavLink
                        to={
                          LoggedInUser.role === "customer"
                            ? "/orderhistory"
                            : "/" + LoggedInUser.role
                        }
                      >
                        {LoggedInUser.role === "customer"
                          ? "Order History"
                          : "Dashboard"}
                      </NavLink>
                    </Dropdown.Item>

                    <Dropdown.Item>
                      <NavLink to="/logout">Logout</NavLink>
                    </Dropdown.Item>
                  </Dropdown>
                </div>

                {/* Mobile User Icon */}
                <div className="md:hidden">
                  <Dropdown
                    label={<FaUser className="text-xl text-gray-700" />}
                    placement="bottom-end"
                  >
                    <Dropdown.Item>
                      <NavLink
                        to={
                          LoggedInUser.role === "customer"
                            ? "/orderhistory"
                            : "/" + LoggedInUser.role
                        }
                      >
                        {LoggedInUser.role === "customer"
                          ? "Order History"
                          : "Dashboard"}
                      </NavLink>
                    </Dropdown.Item>

                    <Dropdown.Item>
                      <NavLink to="/logout">Logout</NavLink>
                    </Dropdown.Item>
                  </Dropdown>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <NavLink to="/cart" className="relative p-2 text-gray-700 hover:text-violet-600">
                  <FaCartPlus className="text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </NavLink>

                <NavLink to="/login">Login</NavLink>

                <NavLink to="/register" className="px-4 py-2 bg-violet-600 text-white rounded-lg">
                  Register
                </NavLink>
              </div>
            )}

            {/* Mobile Toggle */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU FIXED */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white px-4 py-3 space-y-3">

            <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</NavLink>
            <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</NavLink>
            <NavLink to="/SellerRegister" onClick={() => setIsMobileMenuOpen(false)}>Become a Vendor</NavLink>

            {!LoggedInUser ? (
              <div className="pt-3 border-t space-y-2">

                <NavLink to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                  Cart ({cartCount})
                </NavLink>

                <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </NavLink>

                <NavLink to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  Register
                </NavLink>
              </div>
            ) : (
              <div className="pt-3 border-t space-y-2">

                <NavLink to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                  Cart ({cartCount})
                </NavLink>

                <NavLink
                  to={
                    LoggedInUser.role === "customer"
                      ? "/orderhistory"
                      : "/" + LoggedInUser.role
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {LoggedInUser.role === "customer"
                    ? "Order History"
                    : "Dashboard"}
                </NavLink>

                <NavLink to="/logout" onClick={() => setIsMobileMenuOpen(false)}>
                  Logout
                </NavLink>
              </div>
            )}
          </div>
        )}
      </Navbar>
    </>
  );
};