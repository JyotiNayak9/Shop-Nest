import { Table, TextInput } from "flowbite-react";
import { Pagination } from "flowbite-react";
import { HeadingWithLink } from "../../../components/common/title";
import { useContext, useEffect, useState } from "react";
import { RowSkeleton } from "../../../components/common/table/table-skeleton";
import authSvc from "../../auth/auth.service";
import { toast } from "react-toastify";
import { SearchParams } from "../../../config/constants";
import { FaCheck, FaTimes, FaClock } from "react-icons/fa";
import ProductSvc from "../product/product-service";
import { ActionButtons } from "../../../components/common/table/table-actionbuttons";
import AuthContext from "../../../context/auth.context";

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: {
      icon: <FaClock className="mr-1" />,
      bg: "bg-yellow-100 text-yellow-800",
      text: "Pending",
    },
    approved: {
      icon: <FaCheck className="mr-1" />,
      bg: "bg-green-100 text-green-800",
      text: "Approved",
    },
    rejected: {
      icon: <FaTimes className="mr-1" />,
      bg: "bg-red-100 text-red-800",
      text: "Rejected",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    icon: <FaClock className="mr-1" />,
    bg: "bg-gray-100 text-gray-800",
    text: "Unknown",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}
    >
      {config.icon}
      {config.text}
    </span>
  );
};
const SellerProductList = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    limit: 10,
  });
  const [Product, setProduct] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string | null>();
  const [sort, setSort] = useState<any>({});
  const [filter, setFilter] = useState<any>({});
  const [categoryMap, setCategoryMap] = useState<{ [key: string]: string }>({});
  const [brandMap, setBrandMap] = useState<{ [key: string]: string }>({});

  const onPageChange = async (page: number) => {
    console.log(pagination);
    setPagination({
      ...pagination,
      currentPage: page,
    });
    await getAllProduct({
      page: page,
      limit: 10,
      search: search,
      filter: filter,
      sort: sort,
    });
  };

  const { LoggedInUser } = useContext(AuthContext);
  const getAllProduct = async ({
    page = 1,
    limit = 10,
    search = "",
    filter = {},
    sort = {},
  }: SearchParams) => {
    try {
      setLoading(true);

      const response: any = await authSvc.getRequest(
        "/products/seller/" + LoggedInUser._id,
        {
          auth: true,
          params: {
            limit: limit,
            page: page,
            search: search,
            filter: filter,
            sort: sort,
          },
        },
      );
      console.log(response);
      setProduct(response.result);
      console.log(Product);
      setPagination({
        currentPage: response.meta.currentPage,
        totalPage: Math.ceil(response.meta.total / response.meta.limit),
        limit: response.meta.limit,
      });
    } catch (exception) {
      toast.error("Error while fetching Product list");
      console.log(exception);
    } finally {
      setLoading(false);
    }
  };
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
      const response: any = await authSvc.getRequest("/categories/all", {
        auth: true,
      });
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
      const response: any = await authSvc.getRequest("/brands/all", {
        auth: true,
      });
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
      await ProductSvc.deleteRequest("/products/" + id, {
        auth: true,
      });
      toast.success("Product deleted successfully");
      getAllProduct({
        page: 1,
        limit: 10,
      });
    } catch (exception) {
      console.log(exception);
      toast.error("Error while deleting Product");
    }
  };
  return (
    <>
      <HeadingWithLink
        title="Product List"
        link="/seller/Product/create"
        btnText="Add Product"
      />

      <div className="flex flex-col sm:flex-row justify-end items-end mb-3 gap-2">
        <TextInput
          type="search"
          className="w-full sm:w-1/4"
          onChange={(e: any) => {
            setSearch(e.target.value);
          }}
        />
        <div className="flex gap-2 w-full sm:w-auto">
        <select
          className="border p-2 rounded w-full sm:w-auto text-sm"
          onChange={(e) => setSort({ price: e.target.value })}
        >
          <option value="">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
        <select
          className="border p-2 rounded w-full sm:w-auto text-sm"
          onChange={(e) => setFilter({ approvalStatus: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell className="bg-gray-900 text-white py-4">
              Title
            </Table.HeadCell>
            {/* <Table.HeadCell className="bg-gray-900 text-white py-4">Link</Table.HeadCell> */}
            <Table.HeadCell className="bg-gray-900 text-white py-4">
              Image
            </Table.HeadCell>
            <Table.HeadCell className="bg-gray-900 text-white py-4">
              Category
            </Table.HeadCell>
            <Table.HeadCell className="bg-gray-900 text-white py-4">
              Brand
            </Table.HeadCell>
            <Table.HeadCell className="bg-gray-900 text-white py-4">
              Price
            </Table.HeadCell>
            <Table.HeadCell className="bg-gray-900 text-white py-4">
              Stock
            </Table.HeadCell>
            <Table.HeadCell className="bg-gray-900 text-white py-4">
              Status
            </Table.HeadCell>
            <Table.HeadCell className="bg-gray-900 text-white py-4">
              Action
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {loading ? (
              <>
                <RowSkeleton rows={5} columns={5} />
              </>
            ) : (
              <>
                {Product && Product.length > 0 ? (
                  <>
                    {Product.map((row: any, index: number) => (
                      <Table.Row
                        key={index}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {row.title}
                        </Table.Cell>
                        <Table.Cell>
                          <img
                            src={row.image}
                            alt={row.title}
                            className="h-12 w-12 object-cover rounded"
                          />
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
                          <StatusBadge
                            status={row.approvalStatus || "pending"}
                          />
                        </Table.Cell>
                        <Table.Cell className="flex gap-3">
                          <ActionButtons
                            editUrl={`/seller/Product/${row._id}/edit`}
                            deleteAction={deleteData}
                            rowId={row._id}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </>
                ) : (
                  <>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell
                        colSpan={5}
                        className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-center"
                      >
                        No Data Found
                      </Table.Cell>
                    </Table.Row>
                  </>
                )}
              </>
            )}
          </Table.Body>
        </Table>
        <div className="flex overflow-x-auto sm:justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
};

export default SellerProductList;
