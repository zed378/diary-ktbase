// import package
import { Navigate, Outlet } from "react-router-dom";

// create component here
function PrivateRoute({ element: Component, ...rest }) {
  return localStorage.id ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
