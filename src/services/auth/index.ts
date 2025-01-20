import { Router } from "express";
import {loginHandler} from "./handlers/login";
import {refreshTokenHandler} from "./handlers/refreshToken";
import {forgotPasswordHandler, resetPasswordHandler} from "./handlers/password";
import {requestEmailVerificationHandler, verifyEmailHandler} from "./handlers/email";
import validate from "../../middleware/validate";
import { loginSchema, resetPasswordSchema } from "../../validationSchema/user";

const authRoutes = Router();

// Login route
authRoutes.post(
  "/login",
  validate(loginSchema),
  loginHandler
);

// Refresh token route
authRoutes.post(
  "/refresh-token",
  refreshTokenHandler
);

// Forgot password route
authRoutes.post(
  "/forgot-password",
  forgotPasswordHandler
);

// Reset password route
authRoutes.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordHandler
);

// Route to request email verification
authRoutes.post(
  "/email/request-verification",
  requestEmailVerificationHandler
);

// Route to verify email
authRoutes.post(
  "/email/verify",
  verifyEmailHandler
);

export default authRoutes;