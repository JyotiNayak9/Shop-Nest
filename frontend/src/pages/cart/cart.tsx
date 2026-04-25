import { useContext, useEffect, useState } from 'react';
import authSvc from '../auth/auth.service';
import AuthContext from '../../context/auth.context';
import { addToCart } from './cart';
import { Heading3 } from '../../components/common/title';
import { Button, Table } from 'flowbite-react';
import { RowSkeleton } from '../../components/common/table/table-skeleton';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../components/common/loading/loading-component';
import { NavLink } from 'react-router-dom';
import { SingleProductCard } from '../../components/common/card/single-card';

const DisplayCart = () => {
  const { LoggedInUser } = useContext(AuthContext);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recLoading, setRecLoading] = useState(false);

  const getCart = async () => {
    try {
      setLoading(true);
      const response: any = await authSvc.getRequest('/cart/' + LoggedInUser._id, { auth: true });
      setCart(response.items);
      // Fetch recommendations whenever cart changes
      if (response.items.length > 0) {
        fetchRecommendations(response.items);
      }
    } catch (exception: any) {
      toast.error(exception);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (cartItems: any[]) => {
    try {
      setRecLoading(true);
      // Get product IDs from cart
      const productIds = cartItems.map(item => item.productId._id || item.productId);
      
      const ProductId = productIds.join(',');
      const response:any = await authSvc.getRequest(`/recommendation/cart/${ProductId}`, 
        {auth: true},
        );
      
      setRecommendations(response.result || []);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setRecLoading(false);
    }
  };

  const total = async () => {
    try { 
      const response: any = await authSvc.getRequest("/cart/totals/" + LoggedInUser._id, { auth: true });
      setCartTotal(response.totalAmount);
    } catch (exception) {
      toast.error("Error getting total");
    }
  };

  useEffect(() => {
    getCart();
    total();
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
    total();
  };

  const deleteItem = async (id: any) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });
      if (result.isConfirmed) {
        await authSvc.deleteRequest("/cart/" + id, { auth: true });
        getCart();
        total();
        toast.success("Item deleted successfully");
      }
    } catch (exception) {
      toast.error("Error deleting the item");
    }
  };

  return (   
    <>        
      <div className="overflow-x-auto m-10">
        <Table striped>
          <Table.Head>
            <Table.HeadCell className="bg-gray-900 text-white py-4">Title</Table.HeadCell>
            <Table.HeadCell className="bg-gray-900 text-white py-4">Image</Table.HeadCell>
            <Table.HeadCell className="bg-gray-900 text-white py-4">Quantity</Table.HeadCell>
            <Table.HeadCell className="bg-gray-900 text-white py-4">Price</Table.HeadCell>
            <Table.HeadCell className="bg-gray-900 text-white py-4">Total</Table.HeadCell>
            <Table.HeadCell className="bg-gray-900 text-white py-4">
              Action
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {loading ? (
              <RowSkeleton rows={5} columns={5} />
            ) : (
              <>
                {cart && cart.length > 0 ? (
                  cart.map((row: any, index: number) => (
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
                        <Button className='bg-red-700 hover:bg-red-900' onClick={() => deleteItem(row._id)}>
                          <FaTrash />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell colSpan={5} className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-center">
                      No Data Found
                    </Table.Cell>
                  </Table.Row>
                )}
              </>
            )}
          </Table.Body>
        </Table>
        
      

        <div className="flex justify-end mr-10 mt-4">
          <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded shadow mr-10">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Total: {cartTotal}
            </h3>
          </div>
          <NavLink 
            to={"/checkout"}
            className="inline-block shrink-0 rounded-md border border-violet-600 bg-violet-600 px-12 py-4 text-md font-medium text-white transition hover:bg-transparent hover:bg-violet-900 focus:outline-none focus:ring active:text-violet-500"                
          >              
            Proceed to Checkout
          </NavLink>
        </div>
          {/* Recommendations Section */}
        {cart.length > 0 && (
          <div className="mt-12">
            <Heading3><>You Might Also Like</></Heading3>
            {recLoading ? (
              <LoadingComponent />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                {recommendations.map((item) => (
                  <SingleProductCard 
                   key={item._id}
            data={{
              _id: item._id,
              title: item.title,
              slug: `/products/${item.slug || item._id}`,
              image: item.image,
              price: item.price,
            }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default DisplayCart;