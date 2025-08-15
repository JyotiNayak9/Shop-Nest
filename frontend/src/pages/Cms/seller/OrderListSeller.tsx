// import React, { useState, useEffect, useContext } from 'react';
// import { Card, Title, Text, Button, Select, SelectItem, Badge } from '@tremor/react';
// import AuthContext, { useAuth } from '../../../context/auth.context';
// import axios from 'axios';
// // import { API_URL } from '../../../config';
// import { toast } from 'react-toastify';

// interface OrderItem {
//   productId: string;
//   productTitle: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface Order {
//   _id: string;
//   customer: string;
//   items: OrderItem[];
//   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   totalAmount: number;
//   createdAt: string;
//   deliveredAt?: string;
//   shippingInfo: {
//     name: string;
//     phone: string;
//     address: string;
//     city: string;
//   };
// }

// const statusOptions = [
//   { value: 'processing', label: 'Processing' },
//   { value: 'shipped', label: 'Shipped' },
//   { value: 'delivered', label: 'Delivered' },
// ];

// const getStatusBadgeColor = (status: string) => {
//   switch (status) {
//     case 'processing':
//       return 'yellow';
//     case 'shipped':
//       return 'blue';
//     case 'delivered':
//       return 'green';
//     case 'cancelled':
//       return 'red';
//     default:
//       return 'gray';
//   }
// };

// const OrderListSeller: React.FC = () => {
//   const [user , setUser]  = useContext(AuthContext);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

//   useEffect(() => {
//     if (user?._id) {
//       fetchOrders();
//     }
//   }, [user]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_URL}/order/getOrdersBySeller/${user?._id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setOrders(response.data);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       toast.error('Failed to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (orderId: string, newStatus: string) => {
//     try {
//       setUpdatingOrder(orderId);
//       await axios.patch(
//         `${API_URL}/order/update-status/${orderId}`,
//         { status: newStatus },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }
//       );
      
//       // Update the local state
//       setOrders(orders.map(order => 
//         order._id === orderId 
//           ? { 
//               ...order, 
//               status: newStatus as Order['status'],
//               ...(newStatus === 'delivered' && { deliveredAt: new Date().toISOString() })
//             } 
//           : order
//       ));
      
//       toast.success('Order status updated successfully');
//     } catch (error) {
//       console.error('Error updating order status:', error);
//       toast.error('Failed to update order status');
//     } finally {
//       setUpdatingOrder(null);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   if (loading) {
//     return <div>Loading orders...</div>;
//   }

//   return (
//     <div className="p-4">
//       <Title>Manage Orders</Title>
//       <Text>View and update the status of customer orders</Text>
      
//       <div className="mt-6 space-y-4">
//         {orders.length === 0 ? (
//           <Card className="text-center py-8">
//             <Text>No orders found</Text>
//           </Card>
//         ) : (
//           orders.map((order) => (
//             <Card key={order._id} className="mb-4">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <Text className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</Text>
//                   <Text className="text-sm text-gray-500">
//                     {formatDate(order.createdAt)}
//                   </Text>
//                   {order.deliveredAt && (
//                     <Text className="text-sm text-gray-500">
//                       Delivered on: {formatDate(order.deliveredAt)}
//                     </Text>
//                   )}
//                 </div>
//                 <Badge color={getStatusBadgeColor(order.status)}>
//                   {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                 </Badge>
//               </div>
              
//               <div className="mb-4">
//                 <Text className="font-medium mb-2">Customer:</Text>
//                 <Text>{order.shippingInfo.name}</Text>
//                 <Text>{order.shippingInfo.address}</Text>
//                 <Text>{order.shippingInfo.city}</Text>
//                 <Text>Phone: {order.shippingInfo.phone}</Text>
//               </div>
              
//               <div className="mb-4">
//                 <Text className="font-medium mb-2">Items:</Text>
//                 {order.items.map((item, index) => (
//                   <div key={index} className="flex items-center py-2 border-b">
//                     <img 
//                       src={item.image} 
//                       alt={item.productTitle} 
//                       className="w-16 h-16 object-cover rounded mr-4"
//                     />
//                     <div className="flex-1">
//                       <Text className="font-medium">{item.productTitle}</Text>
//                       <Text className="text-sm text-gray-500">
//                         {item.quantity} × ${item.price.toFixed(2)}
//                       </Text>
//                     </div>
//                     <Text className="font-medium">
//                       ${(item.quantity * item.price).toFixed(2)}
//                     </Text>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="flex justify-between items-center mt-4 pt-4 border-t">
//                 <Text className="font-semibold">
//                   Total: ${order.totalAmount.toFixed(2)}
//                 </Text>
                
//                 {order.status !== 'cancelled' && order.status !== 'delivered' && (
//                   <div className="flex items-center space-x-2">
//                     <Select 
//                       value={order.status}
//                       onValueChange={(value) => handleStatusChange(order._id, value)}
//                       disabled={updatingOrder === order._id}
//                     >
//                       {statusOptions.map((option) => (
//                         <SelectItem key={option.value} value={option.value}>
//                           {option.label}
//                         </SelectItem>
//                       ))}
//                     </Select>
//                     {updatingOrder === order._id && (
//                       <span className="text-sm text-gray-500">Updating...</span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderListSeller;
