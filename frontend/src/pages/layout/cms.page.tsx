import { Outlet } from "react-router-dom";
import { AdminHeader } from "../Cms/header/cms-header.compoment";
import CMSSidebar from "../Cms/sidebar/cms-sidebar.component";

const Adminlayout = () => {
  return (
    <>
      <AdminHeader />
      <div className="antialiased bg-gray-50 dark:bg-gray-900">
        <CMSSidebar />

        <main className="p-4 md:ml-64 h-auto pt-20">
         <Outlet/>
        </main>
      </div>
    </>
  );
};

export default Adminlayout;
