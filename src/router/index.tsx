import Login from "../views/login";
import Room from "../views/room";
import { useRoutes } from "react-router-dom";
const routes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/room",
    element: <Room />,
  },
];
export function Router() {
  const element = useRoutes(routes);
  return <>{element}</>;
}