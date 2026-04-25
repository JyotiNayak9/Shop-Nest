import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import authSvc from "../../pages/auth/auth.service";
import { Heading3 } from "../common/title";
import { useNavigate } from "react-router-dom";

const CategoriesSlider = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res:any = await authSvc.getRequest("/category/getall");
        setCategories(res.result || []);
        
        console.log("Categories loaded:", res.result);
      } catch (err) {
        toast.error("Failed to load categories");
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("category-container");
    if (container) {
      const amount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <>
    <div className="flex justify-between mx-20 mt-10 border-b border-violet-200 pb-3">
          <Heading3><>Shop by category</></Heading3>
            {/* <a
              className="bg-violet-700 w-40 rounded-lg text-white text-center py-2.5 text-[18px]"
              href="/categories"
            >
              View more &rarr;
            </a> */}
          </div>
    <div className="relative w-full my-8">
      <div className="relative">
        {/* <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 h-full bg-white/70 px-2 hover:bg-white rounded-l"
        >
          <ChevronLeft />
        </button>
          <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 h-full bg-white/70 px-2 hover:bg-white rounded-l"
        >
          <ChevronRight />
        </button> */}

        <div
          id="category-container"
          className="flex gap-4 overflow-x-auto no-scrollbar px-10 scroll-smooth"
        >
  {categories.map((category) => (
     <div                                                                                           
          key={category._id}
          onClick={() => navigate(`/categories/${category._id}`)}
          className="flex-shrink-0 w-36 cursor-pointer group transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-lg"
        >
      <div className="w-full h-24 overflow-hidden rounded-md">
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
        />
      </div>
      <div className="mt-2 text-center">
        <h4 className="text-lg font-medium group-hover:text-violet-700 transition-colors duration-300">
          {category.title}
        </h4>
      </div>
    </div>
  ))}

        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 h-full bg-white/70 px-2 hover:bg-white rounded-r"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
    </>
  );
};

export default CategoriesSlider;
