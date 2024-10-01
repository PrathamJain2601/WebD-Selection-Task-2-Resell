import { Router } from "express";
import { get_product } from "../controllers/product-controller/get-product.controller";
import { get_products_with_pagination } from "../controllers/product-controller/get-product-pagination.controller";
import { remove_product } from "../controllers/product-controller/remove-product.controller";
import { edit_product } from "../controllers/product-controller/edit-product.controller";
import { create_product } from "../controllers/product-controller/create-product.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { toggle_favorite } from "../controllers/product-controller/toggle-favorite.controller";

const router = Router();

router.get("/get-product", get_product);
router.get("/get-product/paginated", get_products_with_pagination);
router.post("/create-product",isAuthenticated, create_product);
router.put("/edit-product",isAuthenticated, edit_product);
router.delete("/remove-product",isAuthenticated, remove_product);
router.post("/favorite/:productId",isAuthenticated, toggle_favorite);

module.exports = router;