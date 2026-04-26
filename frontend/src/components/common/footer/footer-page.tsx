import { NavLink } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const HomeFooter = () => {
  
  return (
    <footer className="bg-gray-50 text-gray-800 border-t border-gray-200">
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
              <span className="text-xl font-bold text-violet-600">ShopNest</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your trusted marketplace for quality products. Connecting buyers and sellers with ease and convenience.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-500 hover:text-violet-600 transition-colors duration-200"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-violet-600 transition-colors duration-200"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-violet-600 transition-colors duration-200"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-violet-600">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/" 
                  className={({ isActive }) =>
                    `text-gray-600 hover:text-violet-600 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-600 font-medium" : ""
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
                    `text-gray-600 hover:text-violet-600 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-600 font-medium" : ""
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
                    `text-gray-600 hover:text-violet-600 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-600 font-medium" : ""
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
                    `text-gray-600 hover:text-violet-600 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-600 font-medium" : ""
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
            <h3 className="text-lg font-semibold text-violet-600">Services</h3>
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/SellerRegister" 
                  className={({ isActive }) =>
                    `text-gray-600 hover:text-violet-600 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-600 font-medium" : ""
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
                    `text-gray-600 hover:text-violet-600 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-600 font-medium" : ""
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
                    `text-gray-600 hover:text-violet-600 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-600 font-medium" : ""
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
                    `text-gray-600 hover:text-violet-600 transition-colors duration-200 text-sm ${
                      isActive ? "text-violet-600 font-medium" : ""
                    }`
                  }
                >
                  Shopping Cart
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-violet-600">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="w-4 h-4 text-violet-600 mt-1 flex-shrink-0" />
                <span className="text-gray-600 text-sm">
                  Balkumari, Lalitpur<br />Nepal
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="w-4 h-4 text-violet-600 flex-shrink-0" />
                <span className="text-gray-600 text-sm">9800000000</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="w-4 h-4 text-violet-600 flex-shrink-0" />
                <span className="text-gray-600 text-sm">support@shopnest.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

   
    </footer>
  );
}

export default HomeFooter;