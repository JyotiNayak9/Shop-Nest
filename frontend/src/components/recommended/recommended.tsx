// components/Recommendations.tsx
import { useContext, useEffect, useState } from 'react';
import authSvc from '../../pages/auth/auth.service';
import AuthContext from '../../context/auth.context';
import { Heading3 } from '../common/title';
import { SingleProductCard } from '../common/card/single-card';
import { toast } from 'react-toastify';
const Recommendations = ()  => {
    const {LoggedInUser} = useContext(AuthContext)
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recLoading, setRecLoading] = useState(false);

 

  const getCart = async () => {
    try {
      setLoading(true);
      const response: any = await authSvc.getRequest('/cart/' + LoggedInUser._id, { auth: true });
      setCart(response.items);
      // Fetch recommendations whenever cart changes
      if (cart.length > 0) {
        fetchRecommendations(cart);
      }
    } catch (exception: any) {
      toast.error(exception);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (cartItems: any[]) => {
    try {
      setRecLoading(true);
     
      const productIds = cartItems.map(item => item.productId._id || item.productId);
      
      const ProductId = productIds.join(',');
      const response:any = await authSvc.getRequest(`/recommendation/cart/${ProductId}`, 
        {auth: true},
        );
      
      setRecommendations(response.result || []);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setRecLoading(false);
    }
  };
   useEffect(() => {
   
    getCart()
  }, []);
  
      if (loading || recLoading) {
  return (
    <div className="text-center my-10">
      <p>Loading recommendations...</p>
    </div>
  );
}
  return (

     <><div className="flex justify-between mx-20 mt-10 border-b border-violet-200 pb-3">
      <Heading3><>Recommended for you </></Heading3>
    </div><div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mx-20 my-10">
        {recommendations && recommendations.length > 0 ? <>

          {recommendations.map((item) => (
            <SingleProductCard
              key={item._id}
              data={{
                _id: item._id,
                title: item.title,
                slug: `/products/${item.slug || item._id}`,
                image: item.image,
                price: item.price,
              }} />
          ))}


        </> : <>

          <div className="p-4 border rounded text-center">
            <p>No recommendations available.</p>
          </div>

        </>}
      </div></>
  )
};

export default Recommendations;
