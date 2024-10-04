import { Router } from "express";
import { add_to_cart } from "../controllers/cart-controller/add-to-cart.controller";
import { remove_from_cart } from "../controllers/cart-controller/remove-from-cart.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { checkout } from "../controllers/cart-controller/checkout.controller";

const router = Router();

router.post("/add", isAuthenticated, add_to_cart);
router.post("/remove", isAuthenticated, remove_from_cart);
router.post("/checkout", isAuthenticated, checkout);

module.exports = router;
