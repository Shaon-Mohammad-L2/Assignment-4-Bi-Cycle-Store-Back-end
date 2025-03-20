"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routers_1 = __importDefault(require("./routers"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
}));
app.use("/v1/api", routers_1.default);
// Home Route.
const homeRoute = (req, res) => {
    res.status(200).json({
        server: "Active",
        success: true,
        stutas: 200,
        message: "This is Home Route.",
    });
};
app.get("/", homeRoute);
exports.default = app;
