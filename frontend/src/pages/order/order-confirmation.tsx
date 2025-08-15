import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import authSvc from '../auth/auth.service';
import { Button } from 'flowbite-react';
// import { API_BASE_URL } from '../../config/constants';


interface OrderDetails {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentInfo: {
    method: string;
    status: string;
    transactionId?: string;
  };
  createdAt: string;
}

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { state } = location;
  const paymentStatus = state?.status || 'pending';
  const isPaid = paymentStatus === 'success';
  const isCOD = order?.paymentInfo?.method === 'CASH_ON_DELIVERY';

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const response = await authSvc.getRequest(`/order/${orderId}`, { auth: true });
  
        if (response) {
          setOrder(response.data);
          console.log('Order fetched:', response.data);
        } else {
          throw new Error('Failed to fetch order');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden text-center p-8">
          <div className="flex justify-center mb-6">
            {isPaid ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <Clock className="h-16 w-16 text-yellow-500" />
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isPaid 
              ? 'Payment Successful!' 
              : isCOD 
                ? 'Order Placed!' 
                : 'Payment Pending'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {isPaid 
              ? 'Thank you for your payment.'
              : isCOD
                ? 'Your order has been placed successfully.'
                : 'Please complete your payment.'}
          </p>
          
          {order && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
              <p className="text-lg font-semibold">NPR {order.totalAmount.toFixed(2)}</p>
              <p className="text-sm mt-2">
                {isCOD ? 'Cash on Delivery' : 'Paid with ' + order.paymentInfo.method}
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')}
            
            >
              Continue Shopping
            </Button>
            <Button 
              onClick={() => navigate('/orderhistory')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              View Orders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
