import React, { useContext, useEffect, useState } from 'react';
import { Select, SelectItem } from '@tremor/react';
import AuthContext from '../../../context/auth.context';
import authSvc from '../../auth/auth.service';
import { toast } from 'react-toastify';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  seller?: {
    shopName: string;
    email: string;
  };
}

interface Order {
  _id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
  };
  items: OrderItem[];
  shippingInfo?: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
};

const SellerOrderListing: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { LoggedInUser } = useContext(AuthContext)
  const [orders, setOrders] = useState<Order[]>([]);

  const statusOptions = [
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default: // pending
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res: any = await authSvc.getRequest('orders/seller/' + LoggedInUser._id, { auth: true });
        setOrders(res.result);
      } catch (exception: any) {
        console.error('Error fetching orders:', exception);
        toast.error(exception.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    if (LoggedInUser?._id) {
      fetchOrders();
    }
  }, [LoggedInUser]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      await authSvc.patchRequest(
        `orders/${orderId}/status`,
        { status: newStatus },
        { auth: true }
      );
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { 
              ...order, 
              status: newStatus as Order['status'],
              ...(newStatus === 'delivered' && { deliveredAt: new Date().toISOString() })
            } 
          : order
      ));
      
      toast.success('Order status updated successfully');
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Order Management</h2>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border border-gray-300 rounded-xl mb-6 p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-600">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-4 w-full sm:w-auto">
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <Select 
                    value={order.status}
                    onValueChange={(value) => handleStatusUpdate(order._id, value)}
                    disabled={updatingStatus === order._id}
                    className="w-full sm:w-40"
                  >
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
                {updatingStatus === order._id && (
                  <span className="text-xs sm:text-sm text-gray-500">Updating...</span>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-4 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                <p><span className="font-medium">Name:</span> {order.customer.fullName}</p>
                <p><span className="font-medium">Email:</span> {order.customer.email}</p>
              </div>
              {order.shippingInfo && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <p>{order.shippingInfo.name}</p>
                  <p>{order.shippingInfo.address}</p>
                  <p>{order.shippingInfo.city}</p>
                  <p>Phone: {order.shippingInfo.phone}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="p-2 sm:p-3 border-b">Product</th>
                    <th className="p-2 sm:p-3 border-b text-right">Qty</th>
                    <th className="p-2 sm:p-3 border-b text-right">Price (Rs)</th>
                    <th className="p-2 sm:p-3 border-b text-right">Total (Rs)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-2 sm:p-3 border-b">
                        <div className="flex items-center">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded mr-2 sm:mr-3"
                            />
                          )}
                          <span className="text-xs sm:text-sm">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 border-b text-right">{item.quantity}</td>
                      <td className="p-2 sm:p-3 border-b text-right">{item.price.toFixed(2)}</td>
                      <td className="p-2 sm:p-3 border-b text-right font-medium">
                        {(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="p-2 sm:p-3 text-right font-medium text-xs sm:text-sm">Order Total:</td>
                    <td className="p-2 sm:p-3 text-right font-bold text-xs sm:text-sm">
                      {order.totalAmount?.toFixed(2) || 
                        order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* <div className="text-right font-bold text-lg mt-3">
              Order Total: Rs. {item.price * item.quantity}
            </div> */}

          </div>
        ))
      )}
    </div>
  );
};

export default SellerOrderListing;
