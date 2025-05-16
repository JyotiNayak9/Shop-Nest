import { useContext, useEffect, useState } from 'react';
import React from 'react';
import authSvc from '../auth/auth.service';
import AuthContext from '../../context/auth.context';
import CartContext from "../../context/cart.context";   
import { addToCart } from '../Cms/cart';
import { Heading2, Heading3, HeadingWithLink } from '../../components/common/title';
import { Button, Table, TextInput } from 'flowbite-react';
import { RowSkeleton } from '../../components/common/table/table-skeleton';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

export const CartDisplay = () => {
const {LoggedInUser} = useContext(AuthContext)
const [cart, setCart] = useState<any[]>([]);
const [loading, setLoading] = useState(true)
 const getCart = async () => {
 try {
  setLoading(true)
    const response:any = await authSvc.getRequest('/cart/'+LoggedInUser._id,{auth:true});
    console.log(response)
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
    const response =  await authSvc.getRequest("/cart/totals/"+LoggedInUser._id)
    console.log(response)
  }catch(exception){
    toast.error("Error getting total")
  }
}
useEffect(() => {
  getCart();
  total()        
}, []);

const handleQuantityChange = async (row: any, newQty: number) => {
  if (newQty < 1) return;
  
  await addToCart({
    customerId: LoggedInUser._id,
    productId: row.productId._id || row.productId,
    productTitle: row.productTitle,
    quantity: newQty - row.quantity,
    price: row.price,
    image: row.image
  });
  getCart();
};

const deleteItem = async (id:any)=>{
 try{
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
                await authSvc.deleteRequest("/cart/"+id)
                getCart()
                toast.success("Item deleted successfully")
            }
 }catch(exception){
  toast.error("Error deleting the item")
 }
}



return (   
 <>        
       <div className="overflow-x-auto m-10">
         <Table striped>
           <Table.Head>
             <Table.HeadCell className="bg-gray-900 text-white py-4">Title</Table.HeadCell>
             {/* <Table.HeadCell className="bg-gray-900 text-white py-4">Link</Table.HeadCell> */}
             <Table.HeadCell className="bg-gray-900 text-white py-4">Image</Table.HeadCell>
             <Table.HeadCell className="bg-gray-900 text-white py-4">Quantity</Table.HeadCell>
             <Table.HeadCell className="bg-gray-900 text-white py-4">Price</Table.HeadCell>
             <Table.HeadCell className="bg-gray-900 text-white py-4">Total</Table.HeadCell>
             <Table.HeadCell className="bg-gray-900 text-white py-4">
               Action
             </Table.HeadCell>
           </Table.Head>
           <Table.Body className="divide-y">
            { loading ?
             <>
              <RowSkeleton rows={5} columns={5}/>
            
             </> : <>
             {
               cart && cart.length > 0 ? <> 
                {
                 
                 cart.map((row:any, index:number) => (
                 
                  
                   <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                   <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                     {row.productTitle}
                   </Table.Cell>
                   <Table.Cell>
                     <img src={row.image} alt={row.title} className="h-12 w-12 object-cover rounded" />
                   </Table.Cell>
                   <Table.Cell>
                  <input
                    type="number"
                    min={1}
                    value={row.quantity}
                    onChange={(e) => handleQuantityChange(row, parseInt(e.target.value))}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </Table.Cell>
                   <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                     {row.price}
                   </Table.Cell>
                   <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                     {row.quantity * row.price}
                   </Table.Cell>
                   <Table.Cell className="flex gap-3">
                   <Button className='bg-red-700 hover:bg-red-900' onClick={()=>deleteItem(row._id)}><FaTrash  /></Button>
                   </Table.Cell>
                 </Table.Row>
                 ))
                }
               </> : <>
               <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
               <Table.Cell colSpan={5} className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-center">
                 No Data Found
               </Table.Cell>
              
             </Table.Row> 
                </>
             }
             
             </>}
          
           </Table.Body>
         </Table>
         
       </div>
     
           </>
       )
   }
  
   export default CartDisplay
   