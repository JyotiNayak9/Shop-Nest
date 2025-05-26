import { Heading3 } from "../../components/common/title"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import authSvc from "../auth/auth.service";
// import categorySvc from "../Cms/category/category-service";

const CategoryDetailsPage = () => {
  const { slug } = useParams();
  const [category, setcategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<any[]>([]);
//    const [categoryMap, setCategoryMap] = useState<{ [key: string]: string }>({});
//     const [brandMap, setBrandMap] = useState<{ [key: string]: string }>({});

// useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await authSvc.getRequest(`/product/getproductsbycategory/${categoryId}`);
//         setProducts(response.data);
//       } catch (err) {
//         toast('Failed to load products.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [categoryId]);

  const getcategoryBySlug = async () => {
    try {
      const response: any = await authSvc.getRequest(`/category/getcategorybyslug/${slug}`);
      setcategory(response.result);
    } catch (err) {
      toast.error("category not found");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    getcategoryBySlug();
  }, [slug]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!category) return <div className="p-10 text-center">No category found.</div>;

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full">
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{category.title}</h1>

        {
           products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-gray-700">${product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default CategoryDetailsPage;