import express from "express";
import {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
} from "./finance.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorize("ADMIN"), createRecord);

router.get("/", authenticate, authorize("ADMIN", "ANALYST"), getRecords);

router.put("/:id", authenticate, authorize("ADMIN"), updateRecord);

router.delete("/:id", authenticate, authorize("ADMIN"), deleteRecord);

export default router;
