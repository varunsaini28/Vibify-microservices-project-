import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
const app = express();
const PORT = 5000;
// Services URLs
const USER_SERVICE_URL = "http://localhost:5001";
const PRODUCT_SERVICE_URL = "http://localhost:5002";
const ORDER_SERVICE_URL = "http://localhost:5003";
// Middleware to handle JSON
app.use(express.json());
// Helper function to create proxy with type safety
const createServiceProxy = (path, target) => {
    const options = {
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
app.get("/", (req, res) => {
    res.send("API Gateway is running...");
});
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map