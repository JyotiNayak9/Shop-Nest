import React, { useContext, useEffect, useRef } from 'react';
import KhaltiCheckout from 'khalti-checkout-web';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Heading3 } from '../../components/common/title';
import khalti from '../../assets/images/khalthi1.png'; 
import { toast } from 'react-toastify';
import AuthContext from '../../context/auth.context';
const Payment = () => {
  const { id, amount } = useParams<{ id: string; amount: string }>();
  const khaltiCheckout = useRef<any>(null);
  const navigate = useNavigate()
  const {LoggedInUser} = useContext(AuthContext)
  useEffect(() => {
    if (id && amount) {
      const config = {
        publicKey: 'live_public_key_3fbb81e947c04b33902d273ebe53a6de', 
        productIdentity: id,
        productName: 'Shopnest Order',
        productUrl: `http://localhost:5173/order/${id}`,
        eventHandler: {
          async onSuccess(payload: any) {
            try {
              const res = await axios.post(
                'http://localhost:5000/api/khalti/verify',
                {
                  token: payload.token,
                  amount: payload.amount,
                  orderId: id
                },
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              );
              alert('Payment Verified');
              console.log('Verification Response:', res.data);
            } catch (err) {
              alert('Verification failed');
              console.error('Verification error:', err);
            }
          },
          onError(error: any) {
            alert('Payment error occurred');
            console.error(error);
          },
          onClose() {
            console.log('Khalti widget closed');
          }
        },
        paymentPreference: ['KHALTI']
      };

      khaltiCheckout.current = new KhaltiCheckout(config);
    }
  }, [id, amount]);

  const handlePayment = () => {
    if (khaltiCheckout.current && amount) {
      khaltiCheckout.current.show({ amount: parseInt(amount) * 100 });
    }
  };

  const handleONCOD = () => {
   toast.success("Order placed successfully with Cash on Delivery");
   navigate('/orderhistory')
  }
return (
  <div className="flex flex-col items-center justify-center my-10 bg-gray-50 px-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Select Payment Method</h3>
      <p className="text-gray-600">Order ID: <span className="font-medium text-black">{id}</span></p>
      <p className="text-gray-600 mb-6">Amount: <span className="font-medium text-purple-600">Rs. {amount}</span></p>

      {/* Khalti Button */}
      <button
        onClick={handlePayment}
        className="w-full mb-4 rounded-xl overflow-hidden border-2 border-purple-600 hover:shadow-lg transition-all"
      >
        <img src={khalti} alt="Pay with Khalti" className="w-full h-14 object-contain p-2" />
      </button>

      {/* Divider */}
      <div className="relative w-full my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">or</span>
        </div>
      </div>

      
      <button
      onClick={handleONCOD}
      type="button"
        className="w-full bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 transition-all font-medium"
      >
        Cash on Delivery
      </button>
    </div>
  </div>
);

};

export default Payment;
