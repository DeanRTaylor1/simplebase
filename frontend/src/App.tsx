import React, { PropsWithChildren } from "react";
import "./App.css";
import Home from "./views/home.view";
import { HashRouter, Routes, Route } from "react-router-dom";
import Connect from "./views/connect.view";
import MenuBar from "./components/menu/menu";
import WithSidebar from "./layouts/with-sidebar";

const App: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <HashRouter basename="/">
      {" "}
      <div className="max-h-screen overflow-hidden">
        <MenuBar />
        <div className="w-full h-screen bg-white flex flex-col justify-center items-center gap-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connect" element={<Connect />} />
            <Route element={<WithSidebar />}>
              <Route path="/:db-name" element={<Connect />} />
              <Route path="/:db-name/:table-name" element={<Connect />} />
            </Route>
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
