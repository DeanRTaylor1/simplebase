import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { columns } from "./columns";

type ColumnSchema = {
  columnName: string;
  dataType: string;
};

export function generateColumnsFromSchema(
  schema: ColumnSchema[]
): ColumnDef<any>[] {
  const data = schema.map((column) => {
    const isNumeric = ["integer", "float", "double"].includes(column.dataType);
    const isDate = ["timestamp with time zone", "date", "datetime"].includes(
      column.dataType
    );

    return {
      accessorKey: column.columnName,
      header: () => <div>{column.columnName}</div>,
      cell: ({ row }: any) => {
        let value = row.getValue(column.columnName);
        if (isNumeric) {
          value = new Intl.NumberFormat("en-US").format(Number(value));
        } else if (isDate) {
          value = new Date(value as any).toLocaleDateString("en-US");
        }
        return <div>{value as any}</div>;
      },
    };
  });

  return columns(data);
}
