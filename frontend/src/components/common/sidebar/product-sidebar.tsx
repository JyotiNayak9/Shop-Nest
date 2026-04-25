import React from "react";
import CategoryDropdown from "../../category/cat-drop";

interface SidebarLayoutProps {
//   sidebar: React.ReactNode;
  children: React.ReactNode;
    price: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ price, children }) => {
  return (
    <div className="flex gap-6 px-6 py-4">
      {/* Sidebar */}
      <aside className="w-64 border-r pr-4">
        <div className="space-y-6">
          <CategoryDropdown />
          {price}
        </div>
</aside>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default SidebarLayout;
