import React, { PropsWithChildren } from "react";
import "./App.css";
import Home from "./views/home.view";
import { Routes, Route } from "react-router-dom";
import { Hello } from "wailsjs/go/main/App";

const App: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full h-screen bg-zinc-600 flex flex-col justify-center items-center gap-12">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
