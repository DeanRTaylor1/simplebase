import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDBContext } from "@/context/DBContext";
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { tables, currentDB } = useDBContext();
  const location = useLocation();

  return (
    <ScrollArea className="max-h-screen h-full w-48 border border-t-0">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none underline underline-offset-8">
          Tables
        </h4>

        {tables.map((tableName: string) => (
          <>
            <NavLink
              to={`/${currentDB}/${tableName}`}
              className={({ isActive }) =>
                `block text-sm p-2 my-1 rounded-md ${
                  isActive ? "bg-zinc-100/80 " : "text-black"
                } hover:bg-zinc-100/80`
              }
            >
              {tableName}
            </NavLink>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  );
}
