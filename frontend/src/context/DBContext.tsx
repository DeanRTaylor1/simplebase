import React, { createContext, useContext, useState, ReactNode } from "react";

type Tables = string[];

interface DBContextType {
  tables: Tables;
  updateTables: (names: Tables) => void;
  currentDB: string;
  updateCurrentDB: (dbName: string) => void;
}

const DBContext = createContext<DBContextType | undefined>(undefined);

export const useDBContext = (): DBContextType => {
  const context = useContext(DBContext);
  if (context === undefined) {
    throw new Error("useTables must be used within a TablesProvider");
  }
  return context;
};

interface TablesProviderProps {
  children: ReactNode;
}

export const DBProvider: React.FC<TablesProviderProps> = ({ children }) => {
  const [tables, setTables] = useState<Tables>([]);
  const [currentDB, setCurrentDB] = useState<string>("");

  const updateTables = (names: Tables): void => {
    setTables(names);
  };

  const updateCurrentDB = (dbName: string): void => {
    setCurrentDB(dbName);
  };

  return (
    <DBContext.Provider
      value={{ tables, updateTables, updateCurrentDB, currentDB }}
    >
      {children}
    </DBContext.Provider>
  );
};
