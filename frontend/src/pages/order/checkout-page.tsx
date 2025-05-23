import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/auth.context';
import authSvc from '../auth/auth.service';
import { toast } from 'react-toastify';
import { InputLabel, TextInputComponent } from '../../components/common/form/input-component.';
import * as yup from 'yup';
import { set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const schema =yup.object({
        name: yup.string().required(),
        email: yup.string().email().required(),     
        phone: yup.string().required().matches(/^(98|97)\d{8}$/, 'Phone number must be a valid Nepali number (98XXXXXXXX or 97XXXXXXXX)'),
        address: yup.string().required(),
});
 
  const {LoggedInUser} = useContext(AuthContext)
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)
  const[cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate();
   const getCart = async () => {
   try {
    setLoading(true)
      const response:any = await authSvc.getRequest('/cart/'+LoggedInUser._id,{auth:true});
      // console.log(response)
    setCart(response.items);
  }catch(exception:any){
    toast.error(exception)
    console.log(exception)
    }finally{
      setLoading(false)
    }
  }
  const total =async () => {
    try{ 
      const response:any =  await authSvc.getRequest("/cart/totals/"+LoggedInUser._id)
      // console.log(response)
      setCartTotal(response.totalAmount)
    }catch(exception){
      toast.error("Error getting total")
    }
  }
  useEffect(() => {
    getCart();
    total() ;
    setValue("name", LoggedInUser.name);
    setValue("email", LoggedInUser.email);
  }, []);

  const {
        control,
        handleSubmit,
        setError,
        setValue,                                                                                                                                                                            
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
      });


  const handlePlaceOrder = async(data:any) => {
try{
  setLoading(true);
    const customer_data = {
      name: data.name,
      email: data.email,
        phone: data.phone,
        address: data.address,       
    }
    const order_data = {
      customer: customer_data,
        customerId: LoggedInUser._id,
      items: cart,
      totalAmount: cartTotal
    }
    // console.log(order_data)
    const order:any = await authSvc.postRequest("/order/order ", order_data, {auth:true})
    console.log(order)
    toast.success("Order placed successfully")
     if (order && order.result._id) {
      toast.success("Order placed successfully!");
      navigate(`/payment/${order.result._id}/${cartTotal}`);
     }
}catch(exception){
    toast.error("Error placing order")
    console.log(exception)
}
  }
    

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
        <form onSubmit={handleSubmit(handlePlaceOrder)} className=" grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <InputLabel htmlFor="name"> Name</InputLabel>
                
                  <TextInputComponent
                          name= "name"
                          errMsg={errors.name?.message as string}
                          defaultValue=""
                          control = {control}
                          />
                            <InputLabel htmlFor="email"> Email Address</InputLabel>
                
                  <TextInputComponent
                          name= "email"
                          errMsg={errors.email?.message as string}
                          defaultValue=""
                          control = {control}
                          />
       <InputLabel htmlFor="phone"> Phone</InputLabel>
                
                  <TextInputComponent
                          name= "phone"
                          errMsg={errors.phone?.message as string}
                          defaultValue=""
                          control = {control}
                          />
          <InputLabel htmlFor="address"> Address</InputLabel>
                
                  <TextInputComponent
                          name= "address"
                          errMsg={errors.address?.message as string}
                          defaultValue=""
                          control = {control}
                          />
         </div>
       

        <div className="border p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.productId} className="flex justify-between mb-1">
                <img
                  src={item.image}
                  alt={item.productTitle}
                  className="h-12 w-12 object-cover rounded mr-2"/>
                <span>{item.productTitle}</span>
                <span>{item.quantity}</span>

                <span>Rs. {item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4 font-bold">
            <span>Total:</span>
            <span>Rs. {cartTotal}</span>
          </div>

          <button
            onClick={handleSubmit(handlePlaceOrder)}
            className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700"
          >
            Place Order
          </button>
        </div>
    </form>

      </div>
    // </div>
  );
};

export default CheckoutPage;
