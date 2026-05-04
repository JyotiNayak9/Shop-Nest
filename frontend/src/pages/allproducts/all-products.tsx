import { useEffect, useState } from "react";
import { Heading3 } from "../../components/common/title";
import authSvc from "../../pages/auth/auth.service";
import { toast } from "react-toastify";
import { SingleProductCard } from "../../components/common/card/single-card";

export const AllProducts = () => {
  const [product, setproduct] = useState<any[]>([]);
  const getproduct = async () => {
    try{
      // setLoading(true)
      const response: any = await authSvc.getRequest("/products/approved?limit=100" )
      console.log(response)
      setproduct(response.result);
      console.log(product)
      
    }catch(exception){
      toast.error("Error while fetching product list")
      console.log(exception)
    }
    
  }
  useEffect(()=>{
    getproduct()
  },[])

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 lg:px-20 mt-6 lg:mt-10 border-b border-violet-200 pb-3">
      <Heading3><>Products List </></Heading3>
        {/* <a
          className="bg-violet-700 w-40 rounded-lg text-white text-center py-2.5 text-[18px]"
          href="/categories"
        >
          View more &rarr;
        </a> */}
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-4 sm:px-6 lg:px-20 my-6 lg:my-10 gap-4">
      
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

export default AllProducts;