import { Button } from "@/components/ui/button";
import logo from "../assets/images/logo-universal.webp";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-96 h-96 rounded-xl">
        <img
          src={logo}
          alt="logo"
          className="block w-96 h-96 mx-auto bg-no-repeat rounded-xl"
        />
      </div>

      <div
        id="input"
        className="w-full flex justify-center items-center gap-12"
      >
        <Button className="" onClick={() => navigate("/connect")}>
          <Link to="/connect">Get Started</Link>
        </Button>

        <Button className="bg-blue-400 hover:bg-blue-600">Documentation</Button>
      </div>
    </>
  );
}

export default Home;
