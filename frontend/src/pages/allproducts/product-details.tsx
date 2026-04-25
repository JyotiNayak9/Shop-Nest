import { useContext, useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { toast } from "react-toastify";
import authSvc from "../auth/auth.service";
import ProductSvc from "../Cms/product/product-service";
import AuthContext from "../../context/auth.context";
import { Button } from "flowbite-react";
import ProductReview from "../../components/product/ProductReview";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
//    const [categoryMap, setCategoryMap] = useState<{ [key: string]: string }>({});
//     const [brandMap, setBrandMap] = useState<{ [key: string]: string }>({});
const { LoggedInUser } = useContext(AuthContext)
  

  const getProductBySlug = async () => {
    try {
      const response:any = await ProductSvc.getRequest(`/product/getproductbyslug/${slug}`);
      setProduct(response.result);
      console.log(product)
      console.log('Product response:', response);
    } catch (err) {
      toast.error("Product not found");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
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
        productId: product._id,
        productTitle: product.title,
        quantity: 1,
        price: product.price,
        image: product.image[0]
      });
    };
  useEffect(() => {
    getProductBySlug();
  }, [slug]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!product) return <div className="p-10 text-center">No product found.</div>;

  return (
    <>
  
    <div className="bg-gray-100 flex items-center justify-center min-h-screen px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><img
          src={product.image}
          alt="Lenovo Laptop"
          className="w-full h-80 object-cover rounded-xl shadow-md"
        />
         <Button onClick={handleAdd} href="/cart" className="w-full bg-violet-700  text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 mt-10"  >
          Add to Cart
        </Button>
        </div>
            <div className="flex flex-col justify-between">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Brand:</span> {product.brand.title}
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Category:</span> {product.category.title}
        </p>
        <p className="text-black text-xl font-bold mb-2">Rs.{product.price}</p>
        <div className="mb-4">
        <p className="text-gray-600 mb-4">{product.description}</p>
        </div>
        <div className="mb-4">
        <p className="text-gray-600 mb-4"><span className="font-semibold">Features:</span></p>
        <ul className="list-disc list-inside mb-4">
          {product.features.map((feature: string, index: number) => (
            <li key={index} className="text-gray-600">{feature}</li>
          ))}

        </ul>
        </div>
        <div className="mb-4">
      <p className="text-gray-600 font-semibold mb-2">Store Information:</p>
      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
        <p className="text-gray-700"><span className="font-medium">Name:</span> {product.createdBy.store?.name || "N/A"}</p>
      </div>
    </div>

    {/* Add Reviews Section */}
    <div className="mt-6">
      <ProductReview />
    </div>
    {/* <p className="text-gray-700"><span className="font-medium">Location:</span> {product.store?.location || "N/A"}</p> */}
  </div>
</div>

        </div>
         </>
    //   </div>
    // </div>
    
  
  );
};
export default ProductDetailPage;