import { Table, TextInput} from "flowbite-react";
import { HeadingWithLink } from "../../../components/common/title";
import { useEffect, useState } from "react";
import { RowSkeleton } from "../../../components/common/table/table-skeleton";
import authSvc from "../../auth/auth.service";
import { toast } from "react-toastify";
import { ActionButtons } from "../../../components/common/table/table-actionbuttons";

const UserListPage = () => {
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState<string | null>();

    
    const getAllUsers = async () => {
        try {
            setLoading(true);
            const response: any = await authSvc.getRequest("/users/", {auth: true });
            setUsers(response.result);
           
        } catch (exception) {
            toast.error("Error while fetching user list");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            getAllUsers();
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const deleteUser = async (id: string) => {
        try {
            await authSvc.deleteRequest('/users/' + id, { auth: true });
            toast.success("User deleted successfully");
            getAllUsers();
        } catch (exception) {
            toast.error("Error while deleting user");
        }
    }

    return (
        <>
            <HeadingWithLink title="User List" link="/admin/user/create" btnText="Add User" />

            <div className="flex justify-end items-end mb-3">
                <TextInput type="search" className="w-full sm:w-1/4" onChange={(e: any) => {
                    setSearch(e.target.value);
                }} />
            </div>

            <div className="overflow-x-auto">
                <Table striped>
                    <Table.Head>
                        <Table.HeadCell className="bg-gray-900 text-white py-4">Name</Table.HeadCell>
                        <Table.HeadCell className="bg-gray-900 text-white py-4">Email</Table.HeadCell>
                        <Table.HeadCell className="bg-gray-900 text-white py-4">Role</Table.HeadCell>
                        <Table.HeadCell className="bg-gray-900 text-white py-4">Action</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {loading ? (
                            <RowSkeleton rows={5} columns={4} />
                        ) : (
                            users && users.length > 0 ? (
                                users.map((row: any, index: number) => (
                                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {row.name}
                                        </Table.Cell>
                                        <Table.Cell>{row.email}</Table.Cell>
                                        <Table.Cell>{row.role}</Table.Cell>
                                        <Table.Cell>
                                            <ActionButtons
                                                editUrl={`/admin/user/${row._id}/edit`}
                                                deleteAction={deleteUser}
                                                rowId={row._id}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell colSpan={4} className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-center">
                                        No Data Found
                                    </Table.Cell>
                                </Table.Row>
                            )
                        )}
                    </Table.Body>
                </Table>
                {/* <div className="flex overflow-x-auto sm:justify-center">
                    <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPage} onPageChange={onPageChange} />
                </div> */}
            </div>
        </>
    );
}

export default UserListPage; 