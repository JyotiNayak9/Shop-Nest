import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { SearchParams } from "../config/constants";
import authSvc from "../pages/auth/auth.service";
import { toast } from "react-toastify";
import { TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";

interface Search {
    
    search?: string | null| undefined;
   
}

const HeroSection = () => {
  const [search, setSearch] =  useState<string |null>();
  const [loading, setLoading] = useState(false);
  const [Product, setProduct] = useState<any[]>([]);
const navigate = useNavigate()

  const [sort, setSort] = useState<any>({});
   const getAllProduct = async ({search = ''}: Search) => {
      
        try{
          setLoading(true)
          const response: any = await authSvc.getRequest("/product/getproducts", { params : {search: search}})
          console.log(response)
          setProduct(response.result);
          console.log(Product)
         
        }catch(exception){
          toast.error("Error while fetching Product ")
          console.log(exception)
        }
        finally{
        setLoading(false)
        }
      }
     useEffect(()=>{
      const timeout = setTimeout(() =>{
         if (search && search.trim() !== "") {
      getAllProduct({ search });
    } else {
      setProduct([]);
    }
  });
      return () => {
        clearTimeout(timeout)
      }
    },[search])
  return (
    <div className="relative w-full h-[90vh] flex items-center justify-center bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <img
        src="/hero-bg.jpg" // Replace with your own background
        alt="Shop Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent z-0" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
          Shop Smart, Live Better
        </h1>
        <p className="text-lg md:text-xl mb-6 text-purple-100 font-medium">
          Everything you need, in One Click.
        </p>

        {/* Search Bar */}
        <div className="flex items-center gap-2 justify-center">
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-lg w-64 sm:w-80">
            <TextInput type="search"  onChange={(e: any) => {
                      setSearch(e.target.value)
                    }}/>
          </div>
          <button className="bg-white text-purple-600 font-semibold px-5 py-2 rounded-full shadow-md hover:bg-gray-100 transition">
            Search
          </button>
        </div>
{/* Product Results */}
       {Product.length > 0 && (
  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl max-h-60 overflow-y-auto mt-4">
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
        <button onClick={() => navigate('/products')} className="mt-6 px-8 py-3 bg-white/10 border border-white rounded-full text-white font-medium hover:bg-white/20 transition duration-300">
          🔍 Browse All Products
        </button>
      </motion.div>
    </div>
  );
};

export default HeroSection;
