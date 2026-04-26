import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import authSvc from "../../pages/auth/auth.service";
import { Heading3 } from "../common/title";
import { useNavigate } from "react-router-dom";


import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";


import "swiper/swiper-bundle.css";

const CategoriesSlider = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: any = await authSvc.getRequest("/category/getall");
        setCategories(res.result || []);
      } catch (err) {
        toast.error("Failed to load categories");
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
    
      <div className="flex justify-between mx-20 mt-10 border-b border-violet-200 pb-3">
        <Heading3><>Shop by category</></Heading3>
      </div>

      <div className="mx-20 my-8">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          navigation
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
        >
          {categories.map((category) => (
            <SwiperSlide key={category._id}>
              <div
                onClick={() => navigate(`/categories/${category._id}`)}
                className="cursor-pointer group transition-all duration-300 hover:scale-105"
              >
                <div className="w-full h-24 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="mt-2 text-center">
                  <h4 className="text-sm font-medium group-hover:text-violet-700 transition-colors">
                    {category.title}
                  </h4>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default CategoriesSlider;