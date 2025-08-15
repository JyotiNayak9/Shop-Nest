import { useEffect, useState } from "react";
import { Heading2, Heading3 } from "../../components/common/title";
import authSvc from "../../pages/auth/auth.service";
import { ImageWithTitleCard, SingleProductCard } from "../common/card/single-card";
import { toast } from "react-toastify";

export const Homeproduct = () => {
  
  const [product, setproduct] = useState<any[]>([]);
  const getproduct = async () => {
    try {
      // Fetch only approved products by adding filter
      const response: any = await authSvc.getRequest("/product/approved-products");
      
      if (response && response.result) {
        setproduct(response.result);
      }
    } catch (exception) {
      toast.error("Error while fetching approved products");
      console.error("Error fetching products:", exception);
    }
    
  }
  useEffect(()=>{
    getproduct()
  },[])

  return (
    <>
      <div className="flex justify-between mx-20 mt-10 border-b border-violet-200 pb-3">
      <Heading3><>Products List </></Heading3>
        <a
          className="bg-violet-700 w-40 rounded-lg text-white text-center py-4 text-[20px]"
          href="/products"
        >
          View more  &rarr;
        </a>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mx-20 my-10">
        {product.map((item) => (
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
    </>
  );
}

export default Homeproduct;