import { Button, Card } from "flowbite-react";
import SingleCardWithImageAndTitleProps from "./single-card.contracts";
import ProductCardProps from "./product-card.contracts";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../../context/auth.context";
import authSvc from "../../../pages/auth/auth.service";


export const ImageWithTitleCard = ({data}: {data:SingleCardWithImageAndTitleProps}) =>{
    return (
        <>
         <Link to={data.slug} className="block p-2 hover:shadow-lg">
         <Card className="max-w-sm mx-5 my-10"
      renderImage={() => <img  src= {data.image} alt="image 1" className="width={500} "/>}
    >
      <h5 className="text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">   
        <a href={data.slug}>    
        {data.title}
        </a>
      </h5>
     
    </Card>
    </Link>
        </>
    )
}

export const SingleProductCard = ({data}: {data:ProductCardProps})=> {
  const { LoggedInUser } = useContext(AuthContext)
  
   const addToCart = async (data: {
    productId: string;
    quantity: number;
    productTitle: string;
    price: number;
      customerId: string;
      image:any;
  }) => {
    const res = await authSvc.postRequest('/cart', data);
    return res.data;
  };
    const handleAdd = async () => {
      await addToCart({
        customerId: LoggedInUser._id,
        productId: data._id,
        productTitle: data.title,
        quantity: 1,
        price: data.price,
        image: data.image[0]
      });
    };
    return (
        <>
            <Card className=" max-w-sm mx-5 my-10">

        <Link to={data.slug} className="block p-2 hover:shadow-lg">

              
            <img  alt="Gaming mouse" src={data.image} className="width={1000} height={1000}" />
      <a href={data.slug}>
        <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
          {data.title}
        </h5>
      </a>
      <div className="mb-5 mt-2.5 flex items-center">
        {/* <svg
          className="h-5 w-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <svg
          className="h-5 w-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <svg
          className="h-5 w-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <svg
          className="h-5 w-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <svg
          className="h-5 w-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <span className="ml-3 mr-2 rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
          5.0
        </span> */}
        
      </div>
    </Link>

      <div className="flex items-center justify-between ">
        <span className="text-xl font-bold text-gray-900 dark:text-white">{data.price}</span>

        <Button href="/cart" onClick={handleAdd} className="rounded-lg bg-violet-700   text-center text-sm font-medium text-white hover:bg-violet-800 ">
          <FaShoppingCart className="mr-2 -ml-1 h-5 w-5"/> 
        </Button>
        
      </div>
    </Card>
        </>
    )
}
