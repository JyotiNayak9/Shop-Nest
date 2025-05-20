import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../../../context/auth.context';
import authSvc from '../../auth/auth.service';

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  seller?: {
    shopName: string;
    email: string;
  };
};

type Order = {
  _id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
  };
  items: OrderItem[];
};

const OrderListingPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const {loggedInUser} = useContext(AuthContext)
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res:any = await authSvc.getRequest('order/getAllOrders', {auth:true});
        console.log(res);
        setOrders(res);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">All Orders (Admin View)</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border border-gray-300 rounded-xl mb-6 p-5 shadow-sm">
            <div className="flex justify-between mb-3">
              <h3 className="text-lg font-semibold text-blue-600">
                Order #{order._id.slice(-6).toUpperCase()}
              </h3>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                Status: {order.status}
              </span>
            </div>

            {/* Customer Info */}
            <div className="mb-4 text-sm text-gray-700">
              <p><strong>Customer:</strong> {order.customer.fullName}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>

            {/* Order Items */}
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Seller</th>
                  <th className="p-2 border">Qty</th>
                  <th className="p-2 border">Price (Rs)</th>
                  <th className="p-2 border">Total (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">{item.seller?.shopName} <br /><small>{item.seller?.email}</small></td>
                    <td className="p-2 border">{item.quantity}</td>
                    <td className="p-2 border">{item.price}</td>
                    <td className="p-2 border">{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right font-bold text-lg mt-3">
              Order Total: Rs. {order.totalAmount}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderListingPage;
