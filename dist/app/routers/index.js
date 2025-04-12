"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/users/user_route");
const auth_route_1 = require("../modules/auth/auth_route");
const product_route_1 = require("../modules/product/product_route");
const order_route_1 = require("../modules/order/order_route");
const payment_route_1 = require("../modules/payment/payment_route");
const routers = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/products",
        route: product_route_1.ProductRoutes,
    },
    {
        path: "/orders",
        route: order_route_1.OrderRoutes,
    },
    {
        path: "/payments",
        route: payment_route_1.PaymentRoutes,
    },
];
moduleRoutes.forEach((route) => {
    routers.use(route.path, route.route);
});
exports.default = routers;
