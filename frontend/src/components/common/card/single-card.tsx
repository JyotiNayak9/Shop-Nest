import { Button, Card } from "flowbite-react";
import SingleCardWithImageAndTitleProps from "./single-card.contracts";
import ProductCardProps from "./product-card.contracts";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../../../context/auth.context";
import authSvc from "../../../pages/auth/auth.service";
import { toast } from "react-toastify";

export const ImageWithTitleCard = ({
  data,
}: {
  data: SingleCardWithImageAndTitleProps;
}) => {
  return (
    <>
      <Link to={data.slug} className="block p-2 hover:shadow-lg">
        <Card
          className="max-w-sm mx-5 my-10"
          renderImage={() => (
            <img src={data.image} alt="image 1" className="width={500} " />
          )}
        >
          <h5 className="text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
            <a href={data.slug}>{data.title}</a>
          </h5>
        </Card>
      </Link>
    </>
  );
};

export const SingleProductCard = ({ data }: { data: ProductCardProps }) => {
  const { LoggedInUser } = useContext(AuthContext);

  // Track product view when component mounts
  useEffect(() => {
    if (LoggedInUser) {
      trackInteraction("view");
    }
  }, [LoggedInUser, data._id]);

  const addToCart = async (data: {
    productId: string;
    quantity: number;
    productTitle: string;
    price: number;
    customerId: string;
    image: any;
  }) => {
    const res = await authSvc.postRequest("/cart", data);
    return res.data;
  };

  const trackInteraction = async (interactionType: "view" | "add_to_cart") => {
    try {
      await authSvc.postRequest(
        "/recommendation/interaction",
        {
          userId: LoggedInUser._id,
          productId: data._id,
          interactionType,
        },
        { auth: true },
      );
    } catch (error) {
      console.error("Failed to track interaction:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await addToCart({
        customerId: LoggedInUser._id,
        productId: data._id,
        productTitle: data.title,
        quantity: 1,
        price: data.price,
        image: data.image[0],
      });

      await trackInteraction("add_to_cart");

      toast.success("Added to cart successfully");
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    }
  };

  return (
    <>
      <Card className="max-w-sm mx-2 sm:mx-5 my-5 sm:my-10 flex flex-col h-[350px] sm:h-[380px] w-full">
        <Link to={data.slug} className="flex flex-col flex-grow p-2">
          <div className="w-full h-32 sm:h-40 flex items-center justify-center bg-gray-100 rounded-t-lg">
            <img
              src={data.image[0] || data.image}
              alt="Product image"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <h5 className="text-sm sm:text-base lg:text-lg font-semibold mt-2 text-gray-900 dark:text-white line-clamp-2">
            {data.title}
          </h5>
        </Link>

        <div className="flex items-center justify-between p-2">
          <span className="text-base sm:text-lg xl:text-xl font-bold text-gray-900 dark:text-white">
            Rs. {data.price}
          </span>

          <Button
            onClick={handleAdd}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <FaShoppingCart />
          </Button>
        </div>
      </Card>
    </>
  );
};
