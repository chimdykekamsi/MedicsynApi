import { Router } from "express";
import createUserHandler from "./handlers/create";
import findAllUsersHandler from "./handlers/find";
import { findUserByIdHandler, suspendOrActivateUserHandler } from "./handlers/id";
import { uploadProfileImageHandler, changePasswordHandler, updateProfileHandler } from "./handlers/update";
import authenticateUser from "../../middleware/authenticateUser";
import validate from "../../middleware/validate";
import { hasPerm } from "../../middleware/permission";
import deserialize from "../../middleware/deserialize";
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
    deserialize,
    authenticateUser,
    // hasPerm("admin"),
    findAllUsersHandler
  );

// Retrieve user by ID
userRoutes
  .route("/:userId")
  .get(
    deserialize,
    authenticateUser,
    hasPerm("admin", "user"),
    findUserByIdHandler
  );

// Update user profile
userRoutes
  .route("/profile")
  .patch(
    deserialize,
    authenticateUser,
    validate(updateProfileSchema),
    updateProfileHandler
  );

// Change password
userRoutes
  .route("/change-password")
  .patch(
    deserialize,
    authenticateUser,
    validate(changePasswordSchema),
    changePasswordHandler
  );

// Upload profile image
userRoutes
  .route("/upload-profile-image")
  .patch(
    deserialize,
    authenticateUser,
    upload.single("image"),
    uploadProfileImageHandler
  );

userRoutes
  .post("/:userId/suspend-activate",
    deserialize,
    authenticateUser,
    hasPerm("admin"),
    suspendOrActivateUserHandler
  )

export default userRoutes;
