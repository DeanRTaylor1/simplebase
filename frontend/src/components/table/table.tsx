import { FetchSchema, DefaultFetchTableData } from "wailsjs/go/core/App";
import { DataTable } from "./data-table";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { generateColumnsFromSchema } from "./dynamic-cols";
import Loading from "../loading/loading";
import { core } from "wailsjs/go/models";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const payments: any[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
    created_at: `2023-02-25 13:57:00+01`,
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
    created_at: `'2023-02-25 13:57:00+01'::timestamp with time zone`,
  },
];

const createTableObjects = (data: core.TableData): object[] => {
  if (!data?.table_data?.length) return [];
  return data.table_data.map((rowData: any[]) => {
    const rowObject: { [key: string]: any } = {};
    rowData.forEach((columnData: { column_name: string; value: any }) => {
      rowObject[columnData.column_name] = columnData.value;
    });
    return rowObject;
  });
};

export default function Table() {
  const [schema, setSchema] = useState<any>();
  const [data, setData] = useState<any[]>();
  const location = useLocation();

  useEffect(() => {
    const currentTable = location.pathname.split("/")[2];
    getCurrentSchema(currentTable).then((schema) => {
      setSchema(schema);
    });

    getCurrentSchemaData(currentTable, 0, 10).then((data: core.TableData) => {
      if (!data) {
        console.log("no data");
        setData([]);
      }
      const rowData = createTableObjects(data);
      setData(rowData);
    });
  }, [location]);

  async function getCurrentSchema(tableName: string) {
    return FetchSchema(tableName);
  }

  async function getCurrentSchemaData(
    tableName: string,
    offset: number,
    limit: number
  ) {
    return DefaultFetchTableData(tableName, offset, limit);
  }

  if (!schema || !data) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="">
      <DataTable columns={generateColumnsFromSchema(schema)} data={data} />
    </div>
  );
}
