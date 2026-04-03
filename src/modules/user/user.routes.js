import express from "express";

import { 
  register, 
  login, 
  getAllUsers, 
  updateUserRole, 
  toggleUserStatus 
} from "./user.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";

const router = express.Router();

// public 
router.post("/register", register);
router.post("/login", login);


// all protected
router.get("/me", authenticate, (req, res) => {
  res.json(req.user);
});


router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getAllUsers
);

router.put(
  "/:id/role",
  authenticate,
  authorize("ADMIN"),
  updateUserRole
);

router.put(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  toggleUserStatus
);

export default router;
