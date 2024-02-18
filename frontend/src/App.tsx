import React, { PropsWithChildren } from "react";
import "./App.css";
import Home from "./views/home.view";
import { HashRouter, Routes, Route } from "react-router-dom";
import Connect from "./views/connect.view";

const App: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <HashRouter basename="/">
      {" "}
      <div className="w-full h-screen bg-zinc-600 flex flex-col justify-center items-center gap-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connect" element={<Connect />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
