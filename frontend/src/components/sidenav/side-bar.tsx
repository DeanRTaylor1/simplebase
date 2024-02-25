import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDBContext } from "@/context/DBContext";
import { Link, NavLink, useLocation } from "react-router-dom";

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

import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-9 w-9",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <a
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </a>
          )
        )}
      </nav>
    </div>
  );
}
