"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routers = express_1.default.Router();
const authRouter = routers.get("/", (req, res) => {
    res.status(200).json({
        server: "Active",
        success: true,
        stutas: 200,
        message: "Routes.",
    });
});
const moduleRoutes = [
    {
        path: "/auth",
        route: authRouter,
    },
];
moduleRoutes.forEach((route) => {
    routers.use(route.path, route.route);
});
exports.default = routers;
