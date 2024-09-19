import { Table } from "flowbite-react"
import { Pagination } from "flowbite-react"
import { HeadingWithLink } from "../../components/common/title"
import { useEffect, useState } from "react"
import { CellSkeleton, RowSkeleton } from "../../components/common/table/table-skeleton"
const BannerListingPage = () => {
    const [pagination, setPagination] = useState({
        currentPage : 1,
        totalPage: 1,
        limit: 10
    })
    const onPageChange = () => {
        console.log(pagination)
    }
    const [banner, setBanner] =useState([]);
    const [loading, setLoading] =useState(true);

    const getAllbanner = async () => {
      try{

      }catch(exception){
        setLoading(true)
      }
      finally{
      setLoading(false)
      }
    }
    // useEffect(()=>{

    // },[])
    return (
        <>
        <HeadingWithLink title="Banner List" link="/admin/banner/create" btnText="Add Banner"/>

    <div className="overflow-x-auto">
      <Table striped>
        <Table.Head>
          <Table.HeadCell className="bg-gray-900 text-white py-4">Title</Table.HeadCell>
          <Table.HeadCell className="bg-gray-900 text-white py-4">Link</Table.HeadCell>
          <Table.HeadCell className="bg-gray-900 text-white py-4">Image</Table.HeadCell>
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
            banner && banner.length > 0 ? <> 
             {
              banner.map((rows:number, index:number) => {
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {'Apple MacBook Pro 17"'}
                </Table.Cell>
                <Table.Cell>Sliver</Table.Cell>
                <Table.Cell>Laptop</Table.Cell>
                <Table.Cell>$2999</Table.Cell>
                <Table.Cell>
                  <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                    Edit
                  </a>
                </Table.Cell>
              </Table.Row>
              })
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

export default BannerListingPage

