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
const ProductListingPage = () => {
    const [pagination, setPagination] = useState({
        currentPage : 1,
        totalPage: 1,
        limit: 10
    })
    const [Product, setProduct] =useState([]);
    const [loading, setLoading] =useState(true);
    const [search, setSearch] = useState<string |null>();
    const onPageChange =async (page:number) => {
        console.log(pagination);
        setPagination({
            ...pagination,
            currentPage: page
        })
       await getAllProduct({
            page: page,
            limit: 10
        })
    }

    const getAllProduct = async ({page = 1, limit=10, search=''}: SearchParams) => {
      try{
        setLoading(true)
        const response: any = await authSvc.getRequest("/Product/", {auth:true , params : {limit: limit, page: page,search: search}})
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
 

    useEffect(()=>{
      const timeout = setTimeout(() =>{
        getAllProduct({
          page: 1,
          limit: 10,
          search: search
        })
    })
      return () => {
        clearTimeout(timeout)
      }
    },[search])

    const deleteData = async (id:string) => {
   try{
          await ProductSvc.deleteRequest('/Product/'+id, {auth:true})
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
          {/* <Table.HeadCell className="bg-gray-900 text-white py-4">Status</Table.HeadCell> */}
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

