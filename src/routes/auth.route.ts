import { Router } from "express";
import { login } from "../controllers/auth-controller/login.controller";
import { register } from "../controllers/auth-controller/register.controller";
import { logout } from "../controllers/auth-controller/logout.controller";
import { verify_email_otp } from "../controllers/auth-controller/verify-email-otp.controller";
import { send_forgot_password_otp } from "../controllers/auth-controller/send-forgot-password-otp.controller";
import { verify_forgot_password_otp } from "../controllers/auth-controller/verify-forgot-password-otp.controller";
import { send_email_otp } from "../controllers/auth-controller/send-email-otp.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout",isAuthenticated, logout);
router.post("/send-email-otp", send_email_otp);
router.post("/verify-email-otp", verify_email_otp);
router.post("/send-forgot-password-otp", send_forgot_password_otp);
router.post("/verify-forgot-password-otp", verify_forgot_password_otp);

module.exports = router;