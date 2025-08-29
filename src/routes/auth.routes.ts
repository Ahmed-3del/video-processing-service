// routes/auth.routes.ts
import express from "express";
import { register, login } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login as express.RequestHandler);
// router

export default router;
