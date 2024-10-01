import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { get_profile } from "../controllers/profile-controller/get-profile.controller";
import { edit_profile } from "../controllers/profile-controller/edit-profile.controller";

const router = Router();

router.get("/get-profile", isAuthenticated, get_profile);
router.put("/edit-profile", isAuthenticated, edit_profile);

module.exports = router;