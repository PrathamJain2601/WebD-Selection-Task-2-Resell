import { Router } from "express";
import { get_product } from "../controllers/product-controller/get-product.controller";
import { remove_product } from "../controllers/product-controller/remove-product.controller";
import { edit_product } from "../controllers/product-controller/edit-product.controller";
import { create_product } from "../controllers/product-controller/create-product.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.get("/get-product", get_product);
router.post("/create-product",isAuthenticated, create_product);
router.put("/edit-product",isAuthenticated, edit_product);
router.delete("/remove-product",isAuthenticated, remove_product);

module.exports = router;