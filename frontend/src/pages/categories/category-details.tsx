import { Heading2 } from "../../components/common/title"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import authSvc from "../auth/auth.service";
import { SingleProductCard } from "../../components/common/card/single-card";
import SidebarLayout from "../../components/common/sidebar/product-sidebar";
import PriceFilter from "../../components/price/price-filter";
// import categorySvc from "../Cms/category/category-service";

const CategoryDetailsPage = () => {
  const {id} = useParams();
  const [category, setcategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
    const [filters, setFilters] = useState<{ min: number | null; max: number | null }>({
    min: null,
    max: null,
  });

   const getProducts = async () => {
    try {
      const params: any = {};
      if (filters.min !== null) params.minPrice = filters.min;
      if (filters.max !== null) params.maxPrice = filters.max;

      const response: any = await authSvc.getRequest(`/products/category/${id}`,{params});
      setProducts(response.result);
      if (response.result.length > 0) {
        setcategory(response.result[0].category.title);
      }
    } catch (err) {
      toast.error("Products not found");
      console.error(err);
    }
  };



  useEffect(() => {
    getProducts();
    
  }, [id, filters]);
  

 

   return (
      <>
      <SidebarLayout price={
        <PriceFilter
          onApply={(min, max) => setFilters({ min, max })}
        />
      }
      >
      {/* <CategoryDropdown/> */}
        <div className="flex justify-between px-4 sm:px-6 lg:px-20 mt-6 lg:mt-10 border-b border-violet-200 pb-3">
      <Heading2 value={category}></Heading2>
          {/* <a
            className="bg-violet-700 w-40 rounded-lg text-white text-center py-2.5 text-[18px]"
            href="/categories"
          >
            View more &rarr;
          </a> */}
        </div>
  
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-20 my-6 lg:my-10">
        
          {products.map((item) => (
            <SingleProductCard
              key={item._id}
              data={{
                _id: item._id,
                title: item.title,
                slug: `/products/${item.slug || item._id}`,
                image: item.image,
                price: item.price,
              }}
            />
          ))}
       </div>
       </SidebarLayout>
      </>
    );
};
export default CategoryDetailsPage;