import { Table, TextInput } from "flowbite-react"
import { Pagination } from "flowbite-react"
import { HeadingWithLink } from "../../../components/common/title"
import { useEffect, useState } from "react"
import { CellSkeleton, RowSkeleton } from "../../../components/common/table/table-skeleton"
import authSvc from "../../auth/auth.service"
import { toast } from "react-toastify"
import { SearchParams } from "../../../config/constants"
import { NavLink } from "react-router-dom"
import { FaPen, FaTrash } from "react-icons/fa"
import Swal from "sweetalert2"
import ProductSvc from "./product-service"
import { ActionButtons } from "../../../components/common/table/table-actionbuttons"
import { get } from "react-hook-form"
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
  
  
    useEffect(()=>{
      const timeout = setTimeout(() =>{
        getAllProduct({
          page: 1,
          limit: 10,
          search: search
        }),
        getAllCategories(),
        getAllBrand()
    })
      return () => {
        clearTimeout(timeout)
      }
    },[search])

    const deleteData = async (id:string) => {
   try{
          await ProductSvc.deleteRequest('/product/deleteaproduct/'+id, {auth:true})
          toast.success("Product deleted successfully")
          getAllProduct({
            page:1,
            limit:10,
          })
  
        
      }catch(exception){
        console.log(exception)
        toast.error("Error while deleting Product")
      }
    }
    return (
        <>
        <HeadingWithLink title="Product List" link="/admin/Product/create" btnText="Add Product"/>

      <div className="flex justify-end items-end mb-3">
        <TextInput type="search" className="w-1/4 " onChange={(e: any) => {
          setSearch(e.target.value)
        }}/>
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
                <Table.Cell className="flex gap-3">
                  <ActionButtons
                    editUrl={`/admin/Product/${row._id}/edit`}
                    deleteAction={deleteData}
                    rowId={row._id}
                  />
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

