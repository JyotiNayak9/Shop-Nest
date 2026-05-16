import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/auth.context';
import authSvc from '../auth/auth.service';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

type Order = {
  _id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  shippingInfo: {
    name: string;
    phone: string;
    address: string;
    city: string;
    email?: string;
  };
  items: {
    productTitle: string;
    image:string;
    quantity: number;
    price: number;
  }[];
};

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
const {LoggedInUser} = useContext(AuthContext)

const fetchOrders = async () => {
      try {
        const res:any = await authSvc.getRequest('orders/my/'+LoggedInUser._id, {auth:true});
        setOrders(res);
        console.log(orders);
        console.log(res.data);
      } catch(exception:any){
        toast.error(exception)
        console.log(exception)
      } 
    };
  useEffect(() => {   
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId: string) => {

  try {
    const result = await Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!"
            })
            if(result.isConfirmed){
                await authSvc.patchRequest("orders/"+orderId+"/cancel", {auth:true})
                toast.success("Order Cancelled successfully")
                fetchOrders();
            }
       
  } catch (err) {
    toast.error("Failed to cancel order");
    console.error(err);
  }
};

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-300 rounded-xl mb-6 p-4 sm:p-5 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-blue-600">
                Order Id : {order._id.slice(-6).toUpperCase()}
              </h3>
              <span className="text-xs sm:text-sm bg-gray-200 px-2 sm:px-3 py-1 rounded-full">
                Status: {order.status}
              </span>
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded mb-4">
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Shipping Details:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p><strong>Name:</strong> {order.shippingInfo.name}</p>
                <p><strong>Phone:</strong> {order.shippingInfo.phone}</p>
                <p className="sm:col-span-2"><strong>Address:</strong> {order.shippingInfo.address},</p>
                {order.shippingInfo.email && (
                  <p className="sm:col-span-2"><strong>Email:</strong> {order.shippingInfo.email}</p>
                )}
                <p className="sm:col-span-2"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 sm:p-3 border">Image</th>
                    <th className="p-2 sm:p-3 border">Product</th>
                    <th className="p-2 sm:p-3 border">Quantity</th>
                    <th className="p-2 sm:p-3 border">Price (Rs)</th>
                    <th className="p-2 sm:p-3 border">Total (Rs)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-t">
                        <td className="p-2 sm:p-3 border">
                            <img src={item.image} alt={item.productTitle} className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded" /></td>
                      <td className="p-2 sm:p-3 border">{item.productTitle}</td>
                      <td className="p-2 sm:p-3 border">{item.quantity}</td>
                      <td className="p-2 sm:p-3 border">{item.price}</td>
                      <td className="p-2 sm:p-3 border">{item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right font-bold mt-4 text-base sm:text-lg">
              Total: Rs. {order.totalAmount}
            </div>
            {order.status === 'pending' && (
  <div className="text-right mt-2">
    <button
      onClick={() => cancelOrder(order._id)}
      className="px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
    >
      Cancel Order
    </button> 
  </div>
)}

          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;



