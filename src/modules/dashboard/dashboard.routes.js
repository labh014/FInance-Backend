import express from "express";
import {
  getSummary,
  categoryBreakdown,
  monthlyTrends
} from "./dashboard.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/summary", authenticate, authorize("ADMIN", "ANALYST"), getSummary);
router.get("/categories", authenticate, authorize("ADMIN", "ANALYST"), categoryBreakdown);
router.get("/trends", authenticate, authorize("ADMIN", "ANALYST"), monthlyTrends);

export default router;
