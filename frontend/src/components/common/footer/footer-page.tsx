import { NavLink } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const HomeFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={logo} 
                className="h-10 w-auto" 
                alt="ShopNest Logo" 
              />
              <span className="text-xl font-bold text-violet-400">ShopNest</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted marketplace for quality products. Connecting buyers and sellers with ease and convenience.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-violet-400 transition-colors duration-200"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-violet-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-violet-400 transition-colors duration-200"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-violet-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/" 
                  className={({ isActive }) =>
                    `text-gray-300 hover:text-violet-400 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-400 font-medium" : ""
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) =>
                    `text-gray-300 hover:text-violet-400 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-400 font-medium" : ""
                    }`
                  }
                >
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/products" 
                  className={({ isActive }) =>
                    `text-gray-300 hover:text-violet-400 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-400 font-medium" : ""
                    }`
                  }
                >
                  All Products
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/contact" 
                  className={({ isActive }) =>
                    `text-gray-300 hover:text-violet-400 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-400 font-medium" : ""
                    }`
                  }
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-violet-400">Services</h3>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/SellerRegister" 
                  className={({ isActive }) =>
                    `text-gray-300 hover:text-violet-400 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-400 font-medium" : ""
                    }`
                  }
                >
                  Become a Vendor
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/categories" 
                  className={({ isActive }) =>
                    `text-gray-300 hover:text-violet-400 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-400 font-medium" : ""
                    }`
                  }
                >
                  Categories
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/orderhistory" 
                  className={({ isActive }) =>
                    `text-gray-300 hover:text-violet-400 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-400 font-medium" : ""
                    }`
                  }
                >
                  Order History
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/cart" 
                  className={({ isActive }) =>
                    `text-gray-300 hover:text-violet-400 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-400 font-medium" : ""
                    }`
                  }
                >
                  Shopping Cart
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-violet-400">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Balkumari, Lalitpur<br />Nepal
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">9813829957</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">support@shopnest.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              {currentYear} ShopNest. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <NavLink 
                to="/privacy" 
                className="text-gray-400 hover:text-violet-400 transition-colors duration-200"
              >
                Privacy Policy
              </NavLink>
              <NavLink 
                to="/terms" 
                className="text-gray-400 hover:text-violet-400 transition-colors duration-200"
              >
                Terms of Service
              </NavLink>
              <NavLink 
                to="/refund" 
                className="text-gray-400 hover:text-violet-400 transition-colors duration-200"
              >
                Refund Policy
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;