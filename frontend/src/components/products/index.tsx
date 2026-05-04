import { useEffect, useState } from "react";
import { Heading3 } from "../../components/common/title";
import authSvc from "../../pages/auth/auth.service";
import { SingleProductCard } from "../common/card/single-card";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

export const Homeproduct = () => {
  const [product, setproduct] = useState<any[]>([]);
  const getproduct = async () => {
    try {
      const response: any = await authSvc.getRequest(
        "/products/approved",
      );

      if (response && response.result) {
        setproduct(response.result);
      }
    } catch (exception) {
      toast.error("Error while fetching approved products");
      console.error("Error fetching products:", exception);
    }
  };
  useEffect(() => {
    getproduct();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-20 mt-6 lg:mt-10 border-b border-violet-200 pb-3">
        <Heading3>
          <>Products List </>
        </Heading3>
        <NavLink
          to="/products"
          className="bg-violet-600 hover:bg-violet-700 rounded-lg text-white text-center py-2 px-4 text-sm sm:py-3 sm:text-[16px]"
        >
          View all →
        </NavLink>
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
};

export default Homeproduct;
