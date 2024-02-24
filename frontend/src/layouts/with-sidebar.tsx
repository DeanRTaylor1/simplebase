import Sidebar from "@/components/sidenav/side-bar";
import { Outlet } from "react-router-dom";

export default function WithSidebar() {
  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="flex-grow p-4">
        <Outlet />
      </div>
    </div>
  );
}
