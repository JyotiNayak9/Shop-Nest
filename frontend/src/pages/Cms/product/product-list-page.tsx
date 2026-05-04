import { Table, TextInput } from "flowbite-react"
import { Pagination } from "flowbite-react"
import { useEffect, useState } from "react"
import {  RowSkeleton } from "../../../components/common/table/table-skeleton"
import authSvc from "../../auth/auth.service"
import { toast } from "react-toastify"
import { SearchParams } from "../../../config/constants"
import ProductSvc from "./product-service"
import { DeleteButton } from "../../../components/common/table/table-actionbuttons"
const ProductListingPage = () => {
    const [pagination, setPagination] = useState({
        currentPage : 1,
        totalPage: 1,
        limit: 10
    })
    const [Product, setProduct] =useState<any[]>([]);
    const [loading, setLoading] =useState(true);
    const [search, setSearch] = useState<string |null>();
        const [sort, setSort] = useState<any>({});
    const [filter, setFilter] = useState<any>({});
    const [categoryMap, setCategoryMap] = useState<{ [key: string]: string }>({});
    const [brandMap, setBrandMap] = useState<{ [key: string]: string }>({});

    const onPageChange =async (page:number) => {
        console.log(pagination);
        setPagination({
            ...pagination,
            currentPage: page
        })
       await getAllProduct({
            page: page,
            limit: 10,
            search: search,
            filter: filter,
            sort: sort
        })
    }

    const getAllProduct = async ({page = 1, limit=10, search='', filter={}, sort={}}: SearchParams) => {
    
      try{
        setLoading(true)
        const response: any = await authSvc.getRequest("/product/getproducts", {auth:true , params : {limit: limit, page: page, search: search, filter: filter, sort: sort}})
        console.log(response)
        setProduct(response.result);
        console.log(Product)
        setPagination({
          currentPage: response. meta.currentPage,
          totalPage: Math.ceil(response.meta.total / response.meta.limit),
          limit:response.meta.limit
        })
      }catch(exception){
        toast.error("Error while fetching Product list")
        console.log(exception)
      }
      finally{
      setLoading(false)
      }
    }
  //  const  getCategoryDetails = async (id:string) => {
  //     try{
    
  //       const response: any = await authSvc.getRequest("/category/"+id, {auth:true})
  //       console.log(response)
  //       setCategory(response.result);
  //       console.log(category)
  //     }catch(exception){
  //       toast.error("Error while fetching category detail")
  //     }
  //   }
  const getAllCategories = async () => {
    try {
      const response: any = await authSvc.getRequest("/category/getall", { auth: true });
      const map: { [key: string]: string } = {};
      response.result.forEach((cat: any) => {
        map[cat._id] = cat.title;
      });
      setCategoryMap(map);
    } catch (err) {
      toast.error("Failed to fetch categories");
      console.error(err);
    }
  };
  const getAllBrand = async () => {
    try {
      const response: any = await authSvc.getRequest("/brand/getall", { auth: true });
      const map: { [key: string]: string } = {};
      response.result.forEach((br: any) => {
        map[br._id] = br.title;
      });
      setBrandMap(map);
    } catch (err) {
      toast.error("Failed to fetch categories");
      console.error(err);
    }
  };
  
  
useEffect(() => {
    getAllCategories();
    getAllBrand();
}, []); 

useEffect(() => {
    const timeout = setTimeout(() => {
        getAllProduct({ page: 1, limit: 10, search: search });
    }, 500);

    return () => clearTimeout(timeout);
}, [search, sort, filter]);

    const deleteData = async (id: string) => {
        try {
            await ProductSvc.deleteRequest('/product/deleteaproduct/' + id, { auth: true })
            toast.success("Product deleted successfully")
            getAllProduct({
                page: 1,
                limit: 10,
            })
        } catch (exception) {
            console.log(exception)
            toast.error("Error while deleting product")
        }
    }

    const approveProduct = async (id: string) => {
        try {
            await authSvc.patchRequest(`/product/approve/${id}`, {}, { auth: true });
            toast.success("Product approved successfully");
            getAllProduct({
                page: pagination.currentPage,
                limit: pagination.limit,
                search: search,
                filter: filter,
                sort: sort
            });
        } catch (exception) {
            console.log(exception);
            toast.error("Error while approving product");
        }
    };

    const rejectProduct = async (id: string) => {
        try {
            await authSvc.patchRequest(`/product/reject/${id}`, { reason: 'Rejected by admin' }, { auth: true });
            toast.success("Product rejected successfully");
            getAllProduct({
                page: pagination.currentPage,
                limit: pagination.limit,
                search: search,
                filter: filter,
                sort: sort
            });
        } catch (exception) {
            console.log(exception);
            toast.error("Error while rejecting product");
        }
    };
    return (
        <>
        {/* <HeadingWithLink title="Product List" link="/admin/Product/create" btnText="Add Product"/> */}

     <div className="flex justify-end items-end mb-3 gap-2">
  <TextInput
    type="search"
    className="w-1/4"
    onChange={(e: any) => setSearch(e.target.value)}
  />

  <select
    className="border p-2 rounded"
    onChange={(e) => setSort({ price: e.target.value })}
  >
    <option value="">Sort</option>
    <option value="asc">Price ↑</option>
    <option value="desc">Price ↓</option>
  </select>

  <select
    className="border p-2 rounded"
    onChange={(e) => setFilter({ approvalStatus: e.target.value })}
  >
    <option value="">Status</option>
    <option value="pending">Pending</option>
    <option value="approved">Approved</option>
    <option value="rejected">Rejected</option>
  </select>
</div>
       
    <div className="overflow-x-auto">
      <Table striped>
        <Table.Head>
          <Table.HeadCell className="bg-gray-900 text-white py-4">Title</Table.HeadCell>
          {/* <Table.HeadCell className="bg-gray-900 text-white py-4">Link</Table.HeadCell> */}
          <Table.HeadCell className="bg-gray-900 text-white py-4">Image</Table.HeadCell>
          <Table.HeadCell className="bg-gray-900 text-white py-4">Category</Table.HeadCell>
          <Table.HeadCell className="bg-gray-900 text-white py-4">Brand</Table.HeadCell>
          <Table.HeadCell className="bg-gray-900 text-white py-4">Price</Table.HeadCell>
          <Table.HeadCell className="bg-gray-900 text-white py-4">Stock</Table.HeadCell>
          <Table.HeadCell className="bg-gray-900 text-white py-4">Status</Table.HeadCell>
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
            Product && Product.length > 0 ? <> 
             {
              
              Product.map((row:any, index:number) => (
              
               
                <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {row.title}
                </Table.Cell>
                <Table.Cell>
                  <img src={row.image} alt={row.title} className="h-12 w-12 object-cover rounded" />
                </Table.Cell>
               
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {categoryMap[row.category] || "N/A"}
                </Table.Cell>

                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {brandMap[row.brand] || "N/A"}
                </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {row.price}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {row.quantity}
                </Table.Cell>
                <Table.Cell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                    row.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {row.approvalStatus?.toUpperCase() || 'PENDING'}
                  </span>
                </Table.Cell>
                <Table.Cell className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveProduct(row._id)}
                      className=" text-2xl text-green-600 hover:text-green-900 disabled:opacity-30"
                      disabled={row.approvalStatus === 'approved'}
                      title="Approve Product"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => rejectProduct(row._id)}
                      className="text-red-600 hover:text-red-900 text-2xl disabled:opacity-30 px-2"
                      disabled={row.approvalStatus === 'rejected'}
                      title="Reject Product"
                    >
                      ✕
                    </button>
                    <DeleteButton
                      deleteAction={deleteData}
                      rowId={row._id}
                    />
                  </div>
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
      <div className="flex overflow-x-auto sm:justify-center">
      <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPage} onPageChange={onPageChange} />
    </div>
    </div>
  
        </>
    )
}

export default ProductListingPage

