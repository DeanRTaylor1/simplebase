import { Button } from "@/components/ui/button";
import { useState } from "react";
import logo from "../assets/images/logo-universal.webp";
import "../App.css";
import { Hello } from "wailsjs/go/main/App";

function Home() {
  const [resultText, setResultText] = useState(
    "Please enter your name below 👇"
  );
  const [name, setName] = useState("");
  const updateName = (e: any) => setName(e.target.value);
  const updateResultText = (result: string) => setResultText(result);

  function greet() {
    Hello("dean").then(updateResultText);
  }

  return (
    <>
      <div className="w-96 h-96 rounded-xl">
        <img
          src={logo}
          alt="logo"
          className="block w-96 h-96 mx-auto bg-no-repeat rounded-xl"
        />
      </div>
      <div id="result" className="w-full flex justify-center items-center mb-4">
        {resultText}
      </div>

      <div
        id="input"
        className="w-full flex justify-center items-center gap-12"
      >
        <Button className="" onClick={greet}>
          Get Started
        </Button>
        <Button className="bg-blue-400 hover:bg-blue-600" onClick={greet}>
          Documentation
        </Button>
      </div>
    </>
  );
}

export default Home;
