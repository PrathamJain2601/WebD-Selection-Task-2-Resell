import express from "express";
import { add_to_cart } from "../controllers/cart-controller/add-to-cart.controller";
import { remove_from_cart } from "../controllers/cart-controller/remove-from-cart.controller";

const router = express.Router();

router.post("/cart/add", add_to_cart);
router.post("/cart/remove", remove_from_cart);

export default router;
