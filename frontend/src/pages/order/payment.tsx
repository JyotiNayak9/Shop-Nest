import React, { useContext, useEffect, useRef, useState } from 'react';
import KhaltiCheckout from 'khalti-checkout-web';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { API_BASE_URL } from '../../config/constants';
import AuthContext from '../../context/auth.context';
import khaltiLogo from '../../assets/images/khalthi1.png';
import { Loader2 } from 'lucide-react';
import authSvc from '../auth/auth.service';

interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    orderId: string;
    amount: number;
    status: string;
  };
}

const Payment = () => {
  const { id: orderId, amount } = useParams<{ id: string; amount: string }>();
  const khaltiCheckout = useRef<any>(null);
  const navigate = useNavigate();
  const { LoggedInUser, token } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'KHALTI' | 'COD' | null>(null);


  useEffect(() => {
    
    if (!orderId || !amount) {
      toast.error('Invalid order details');
      navigate('/checkout');
      return;
    }

    const config = {
      publicKey: import.meta.env.VITE_KHALTI_PUBLIC_KEY ,
      productIdentity: orderId,
      productName: 'ShopNest Order',
      productUrl: `${window.location.origin}/order/${orderId}`,
      eventHandler: {
        onSuccess: async (payload: any) => {
          setIsProcessing(true);
           if (!payload.token || !payload.amount) {
              toast.error('Invalid payment response from Khalti');
              return;
            }
          try {
           
            const response = await authSvc.postRequest('/payment/khalti/verify',{
              token: payload.token,
              amount: payload.amount,
              orderId: orderId
            }, { auth: true });


            if (response.data.success) {
              toast.success('Payment successful!');
              navigate(`/order-confirmation/${orderId}`, {
                state: { 
                  paymentId: response.data.data.paymentId,
                  status: 'success' 
                }
              });
            }

          } catch (error: any) {
            console.error('Payment verification error:', error);
            const errorMessage = error.response?.data?.message || 'Payment verification failed';
            toast.error(errorMessage);
          } finally {
            setIsProcessing(false);
          }
        },
        onError: (error: any) => {
          console.error('Payment error:', error);
          toast.error('Payment failed. Please try again.');
          setIsProcessing(false);
        },
        onClose: () => {
          if (paymentMethod === 'KHALTI') {
            setPaymentMethod(null);
          }
        }
      },
      paymentPreference: ['KHALTI']
    };

    khaltiCheckout.current = new KhaltiCheckout(config);
  }, [orderId, amount, token, navigate, paymentMethod]);

  const handleKhaltiPayment = () => {
    if (!khaltiCheckout.current || !amount) return;
    
    setPaymentMethod('KHALTI');
    khaltiCheckout.current.show({ amount: parseInt(amount) * 100 });
  };

  const handleCashOnDelivery = async () => {
    if (!orderId) return;
    
    setIsProcessing(true);
    setPaymentMethod('COD');
    
    try {
      const response = await authSvc.postRequest('/payment/cod',{orderId: orderId}, { auth: true }); 

      
      if (response.data) {
        toast.success('Order placed successfully with Cash on Delivery');
        navigate(`/order-confirmation/${orderId}`);
      }
    } catch (error: any) {
      console.error('COD Error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to place COD order';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      setPaymentMethod(null);
    }
  };

  if (!orderId || !amount) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h2>
            <p className="mt-2 text-sm text-gray-600">Order #{orderId}</p>
            <p className="text-lg font-semibold text-indigo-600 mt-2">
              Total: NPR {parseFloat(amount).toFixed(2)}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Choose a payment method</h3>
              
              {/* Khalti Payment Option */}
              <button
                onClick={handleKhaltiPayment}
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-4 mb-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'KHALTI' 
                    ? 'border-indigo-600 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-500 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <img 
                    src={khaltiLogo} 
                    alt="Khalti" 
                    className="h-8 mr-3"
                  />
                  <span className="font-medium">Pay with Khalti</span>
                </div>
                <span className="text-indigo-600">Secure Payment</span>
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Cash on Delivery Option */}
              <button
                onClick={handleCashOnDelivery}
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-indigo-600 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-500 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="font-medium">Cash on Delivery</span>
                </div>
                <span className="text-gray-500">Pay when you receive</span>
              </button>
            </div>

            {/* Loading State */}
            {isProcessing && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin h-6 w-6 text-indigo-600 mr-2" />
                <span className="text-gray-600">Processing your request...</span>
              </div>
            )}

      
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/cart')}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                disabled={isProcessing}
              >
                ← Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
