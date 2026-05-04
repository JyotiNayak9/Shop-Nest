import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import authSvc from "../pages/auth/auth.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Search {
  search?: string | null | undefined;
}

const HeroSection = () => {
  const [search, setSearch] = useState<string | null>();
  const [Product, setProduct] = useState<any[]>([]);
  const navigate = useNavigate();

  const getAllProduct = async ({ search = "" }: Search) => {
    try {
      const response: any = await authSvc.getRequest("/product/getproducts", {
        params: { search: search },
      });
      console.log(response);
      setProduct(response.result);
      console.log(Product);
    } catch (exception) {
      toast.error("Error while fetching Product ");
      console.log(exception);
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search && search.trim() !== "") {
        getAllProduct({ search });
      } else {
        setProduct([]);
      }
    });
    return () => {
      clearTimeout(timeout);
    };
  }, [search]);
  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[90vh] flex items-center justify-center bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 text-white overflow-hidden">
      {/* Background Image with Overlay */}
      {/* <img
        src="/hero-bg.jpg" // Replace with your own background
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      /> */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent z-0" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-3xl"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
          Shop Smart, Live Better
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 text-purple-100 font-medium">
          Everything you need, in One Click.
        </p>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2 justify-center">
          <div className="flex items-center bg-white rounded-full px-3 sm:px-4 py-2 shadow-lg w-full sm:w-64 md:w-80">
            <input
              type="search"
              placeholder="Search products..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none border-none"
            />
          </div>
          <button className="w-full sm:w-auto bg-white text-purple-600 font-semibold px-4 sm:px-5 py-2 rounded-full shadow-md hover:bg-gray-100 transition mt-2 sm:mt-0">
            Search
          </button>
        </div>
        {/* Product Results */}
        {Product.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl max-h-60 overflow-y-auto mt-4 mx-4 sm:mx-auto max-w-2xl">
            <h3 className="text-white text-lg font-semibold mb-2">Results:</h3>
            <ul className="space-y-2">
              {Product.map((prod, index) => (
                <li
                  key={index}
                  onClick={() => navigate(`/products/${prod.slug || prod._id}`)}
                  className="text-white text-base bg-white/5 p-2 rounded-md cursor-pointer hover:bg-white/10 transition"
                >
                  {prod.title}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={() => navigate("/products")}
          className="mt-6 px-6 sm:px-8 py-3 bg-white/10 border border-white rounded-full text-white font-medium hover:bg-white/20 transition duration-300 text-sm sm:text-base"
        >
          🔍 Browse All Products
        </button>
      </motion.div>
    </div>
  );
};

export default HeroSection;
