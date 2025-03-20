import express from "express";

const routers = express.Router();

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

export default routers;
