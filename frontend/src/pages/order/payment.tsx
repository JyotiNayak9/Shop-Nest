import React, { useEffect, useRef } from 'react';
import KhaltiCheckout from 'khalti-checkout-web';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import authSvc from '../auth/auth.service';

const Payment = () => {
  const { id, amount } = useParams<{ id: string; amount: string }>();
    const khaltiCheckout = useRef<any>(null);
console.log(id, amount);
  useEffect(() => {
    if (id && amount) {
       
      const config = {
        publicKey: '42c2cc86725e4f67b95deed834f2f9f0', // Replace with real key
        productIdentity: id,
        productName: 'Shopnest Order',
        productUrl: `http://localhost:5173/order/${id}`,
        eventHandler: {
          onSuccess(payload: any) {
            // axios.post('/api/khalti/verify', {
            //   token: payload.token,
            //   amount: payload.amount,
            //   id,
            // }, {
            //   headers: {
            //     Authorization: `Bearer ${localStorage.getItem('token')}`,
            //   },
            // })
            authSvc.postRequest('/payment/verify',{token:payload.token, amount: payload.amount, orderId: id}, {auth:true})
           
            .then(() => alert("Payment verified successfully!"))
            .catch(() => alert("Payment verification failed"));
          },
          onError(error: any) {
            console.error(error);
            alert('Payment error occurred');
          },
          onClose() {
            console.log('Payment popup closed');
          }
        },
        paymentPreference: ['KHALTI'],
      };

       khaltiCheckout.current = new KhaltiCheckout(config);
    }
  }, [id, amount]);

    const handlePayment = () => {
    if (khaltiCheckout.current && amount) {
      khaltiCheckout.current.show({ amount: parseInt(amount) * 100 });
    }
  };
  return (
    <div className="text-center mt-10">
      <h2 className="text-xl font-bold">Processing Payment</h2>
      <p>Order ID: {id}</p>
      <p>Amount: Rs. {amount}</p>
       <button
        onClick={handlePayment}
        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Pay with Khalti
      </button>
    </div>
  );
};

export default Payment;
