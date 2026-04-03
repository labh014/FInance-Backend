import express from "express";
import { register, login } from "./user.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticate, (req, res) => {
  const userResponse = { ...req.user };
  delete userResponse.password;
  res.json(userResponse);
});

export default router;
