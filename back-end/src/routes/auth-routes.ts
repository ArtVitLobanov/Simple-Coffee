import { Router } from "express";
import { AuthController } from "../controllers/auth-controller.js";
import { AuthMiddleware } from "../middleware/auth-middleware.js";

const router = Router();

router.get("/get-is-admin", AuthMiddleware.authRequired, AuthController.getIsAdmin)

router.post("/post-auth-client", AuthController.postAuthClient)

export default router