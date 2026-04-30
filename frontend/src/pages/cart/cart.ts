import authSvc from '../auth/auth.service';


export const addToCart = async (data: {
  productId: string;
  quantity: number;
  productTitle: string;
  price: number;
    customerId: string;
    image:string
}) => {
  const res = await authSvc.postRequest('/cart', data);
  window.dispatchEvent(new Event("cartUpdated"));
  console.log("jyoti add to cart")
  return res.data;

};

// // export const getCart = async () => {
// //   const res = await authSvc.getRequest('/cart/:id');
// //   return res.data;
// // };

// export const getCartTotals = async () => {
//   const res = await authSvc.getRequest('/cart/totals/:id');
//   return res.data;
// };
