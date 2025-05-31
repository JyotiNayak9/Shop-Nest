// components/Recommendations.tsx
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import authSvc from '../../pages/auth/auth.service';
import AuthContext from '../../context/auth.context';
import { useNavigate } from 'react-router-dom';
import { Heading3 } from '../common/title';
import { SingleProductCard } from '../common/card/single-card';
const Recommendations = ()  => {
    const [products, setProducts] = useState<any[]>([]);
    const {LoggedInUser} = useContext(AuthContext)
    const navigate = useNavigate()

    const fetchRecommendations = async () => {
        try {
            const response: any = await authSvc.getRequest(`/recommendation/${LoggedInUser._id}`);
            setProducts(response.result);
            console.log(products)
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };
  useEffect(() => {
   
   fetchRecommendations()
  
  }, []);

  return (
     <><div className="flex justify-between mx-20 mt-10 border-b border-violet-200 pb-3">
      <Heading3><>Recommended for you </></Heading3>
    </div><div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mx-20 my-10">
        {products && products.length > 0 ? <>

          {products.map((item) => (
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
