import { Outlet } from "react-router-dom";
import { AdminHeader } from "../Cms/header/cms-header.compoment";
import SellerSidebar from "../Cms/sidebar/seller-sidebar";

const SellerLayout = () => {
  return (
    <>
      <AdminHeader />
      <div className="antialiased bg-gray-50 dark:bg-gray-900">
        <SellerSidebar />

        <main className="p-4 md:ml-64 h-auto pt-20">
         <Outlet/>
        </main>
      </div>
    </>
  );
};

export default SellerLayout;
