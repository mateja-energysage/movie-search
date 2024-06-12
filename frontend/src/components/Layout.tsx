import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ token, logout }: any) => {
  return (
    <>
      <Navbar token={token} logout={logout} />
      <Outlet />
    </>
  );
};

export default Layout;
