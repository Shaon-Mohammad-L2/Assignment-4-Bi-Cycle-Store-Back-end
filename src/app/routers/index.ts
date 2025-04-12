import express from "express";
import { UserRoutes } from "../modules/users/user_route";
import { AuthRoutes } from "../modules/auth/auth_route";
import { ProductRoutes } from "../modules/product/product_route";
import { OrderRoutes } from "../modules/order/order_route";
import { PaymentRoutes } from "../modules/payment/payment_route";

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
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/payments",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => {
  routers.use(route.path, route.route);
});

export default routers;
