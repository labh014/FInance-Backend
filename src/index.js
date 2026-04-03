import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import userRoutes from "./modules/user/user.routes.js";
import financeRoutes from "./modules/finance/finance.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { success: false, message: "Too many requests, please try again later." }
});

app.use(cors());
app.use(express.json());
app.use(limiter);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.use("/api/users", userRoutes);
app.use("/api/records", financeRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
