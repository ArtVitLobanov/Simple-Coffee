import { Router } from "express";
import { ProductController } from "../controllers/product-controller.js";
import { AuthMiddleware } from "../middleware/auth-middleware.js";

const router = Router()

router.get("/get-products", ProductController.getProducts)

router.post("/post-make-transaction", ProductController.postMakeTransaction)

router.post("/post-update-product", AuthMiddleware.adminRequired, ProductController.postUpdateProduct)

export default router