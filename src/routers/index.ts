import express from "express";
import { UserRoutes } from "../modules/users/user_route";
import { AuthRoutes } from "../modules/auth/auth_route";

const routers = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
];

moduleRoutes.forEach((route) => {
  routers.use(route.path, route.route);
});

export default routers;
