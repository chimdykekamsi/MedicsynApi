import { Router } from "express";
import createUserHandler from "./handlers/create";
import findAllUsersHandler from "./handlers/find";
import { findUserByIdHandler } from "./handlers/findOne";
import { uploadProfileImageHandler, changePasswordHandler, updateProfileHandler } from "./handlers/update";
import authenticateUser from "../../middleware/authenticateUser";
import validate from "../../middleware/validate";
import { hasPerm } from "../../middleware/permission";
import { createUserSchema, updateProfileSchema, changePasswordSchema } from "../../validationSchema/user";
import multer from "multer";

// Multer setup for handling file uploads
const upload = multer({ dest: "uploads/" });

const userRoutes = Router();

// User creation and retrieval
userRoutes
  .route("/")
  .post(
    validate(createUserSchema),
    createUserHandler
  )
  .get(
    authenticateUser,
    hasPerm("admin", "user"),
    findAllUsersHandler
  );

// Retrieve user by ID
userRoutes
  .route("/:userId")
  .get(
    authenticateUser,
    hasPerm("admin", "user"),
    findUserByIdHandler
  );

// Update user profile
userRoutes
  .route("/profile")
  .patch(
    authenticateUser,
    validate(updateProfileSchema),
    updateProfileHandler
  );

// Change password
userRoutes
  .route("/change-password")
  .patch(
    authenticateUser,
    validate(changePasswordSchema),
    changePasswordHandler
  );

// Upload profile image
userRoutes
  .route("/upload-profile-image")
  .patch(
    authenticateUser,
    upload.single("image"), // Use multer to handle the image upload
    uploadProfileImageHandler
  );

export default userRoutes;
