import express, { Request, Response, NextFunction } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import dotevn from "dotenv"
dotevn.config();

const app = express();
const PORT = process.env.PORT;

// Services URLs
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const PRODUCT_SERVICE_URL = "http://localhost:5002";
const ORDER_SERVICE_URL = "http://localhost:5003";

// Middleware to handle JSON
app.use(express.json());

// Helper function to create proxy with type safety
const createServiceProxy = (path: string, target: string) => {
  const options: Options = {
    target,
    changeOrigin: true,
    pathRewrite: { [`^${path}`]: "" },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Proxy] ${req.method} ${req.originalUrl} -> ${target}`);
    },
  };
  return createProxyMiddleware(options);
};

// Routes
app.use("/users", createServiceProxy("/users", USER_SERVICE_URL));
app.use("/products", createServiceProxy("/products", PRODUCT_SERVICE_URL));
app.use("/orders", createServiceProxy("/orders", ORDER_SERVICE_URL));

// Optional: Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("API Gateway is running...");
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
