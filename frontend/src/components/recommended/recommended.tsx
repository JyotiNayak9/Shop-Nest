// components/Recommendations.tsx
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import authSvc from '../../pages/auth/auth.service';
import AuthContext from '../../context/auth.context';
import { useNavigate } from 'react-router-dom';
import { Heading3 } from '../common/title';
const Recommendations = ()  => {
    const [products, setProducts] = useState<any[]>([]);
    const {LoggedInUser} = useContext(AuthContext)
    const navigate = useNavigate()
  useEffect(() => {
   
    authSvc.getRequest(`/recommendation/${LoggedInUser._id}`).then(res => {
      setProducts(res.data);
      console.log(products)
    });
  }, []);

  return (
     <div className="flex justify-between mx-20 mt-10 border-b border-violet-200 pb-3">
          <Heading3><>Recommended for you </></Heading3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mx-20 my-10">
        {products && products.length > 0 ? <> 
        {products.map((p: any) => (
          <div key={p._id} className="p-4 border rounded">
            <h3>{p.name}</h3>
            <p className="text-sm text-gray-500">{p.brand} - {p.category}</p>
          </div>
        ))}
    
    </>:<>
        
          <div className="p-4 border rounded text-center">
            <p>No recommendations available.</p>
            </div>
        
            </>
        }
      </div>
    </div>
  );
};

export default Recommendations;
