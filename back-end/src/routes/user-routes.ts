import { Router } from "express";
import { UserController } from "../controllers/user-controller.js";
import { AuthMiddleware } from "../middleware/auth-middleware.js";

const router = Router()

router.get("/get-user-profile", AuthMiddleware.authRequired, UserController.getUserProfile)

export default router