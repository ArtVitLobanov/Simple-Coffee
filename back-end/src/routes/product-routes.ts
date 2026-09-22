import { Router } from "express";
import { ProductController } from "../controllers/product-controller.js";
import { AuthMiddleware } from "../middleware/auth-middleware.js";

const router = Router()

// Products CRUD
router.post("/post-create-product", ProductController.postCreateProduct)
router.get("/get-products", ProductController.getProducts)
router.post("/post-update-product", AuthMiddleware.adminRequired, ProductController.postUpdateProduct)
router.post("/post-delete-product", ProductController.postDeleteProduct)


router.post("/post-make-transaction", ProductController.postMakeTransaction)


export default router