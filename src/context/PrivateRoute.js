// import package
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

// import assets
import { UserContext } from "./UserContext";

// create component here
function PrivateRoute({ element: Component, ...rest }) {
  return localStorage.id ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
