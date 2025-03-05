import { object, optional, string, TypeOf, z } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: " Name is required",
    }),

    password: string({
      required_error: " Password is required",
    })
      .min(8, "Password should not be less than 8 character")
      .regex(
        /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*./%|?><]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {
          message:
            "Password must contain uppercase letter, lowercase letter, a number and any of (!@#$%^&*./%|?><)",
        }
      ),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid Email"),
    phoneNumber: string().length(11).optional(),
    role: z.enum(["admin", "user", "manager"]).optional(),
    condition: string().optional(),
    profile_url: string().optional()
  }),
});
export type createUserInput = TypeOf<typeof createUserSchema>["body"];

export const loginSchema = object({
  body: object({
    password: string({
      required_error: " Password is required",
    }).min(8, "Password should not be less than 8"),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid Email")
  }),
});
export type loginInput = TypeOf<typeof loginSchema>["body"];

export const updateProfileSchema = object({
  body: object({
    phoneNumber: string()
      .regex(/^\d{11}$/, "Phone number must be 11 digits")
      .optional(),
    condition: string().optional(),
  }),
});
export type UpdateProfileInput = typeof updateProfileSchema._type["body"];

export const changePasswordSchema = object({
  body: object({
    oldPassword: string({
      required_error: "Old password is required",
    }),
    newPassword: string({
      required_error: "New password is required",
    })
      .min(8, "New Password should not be less than 8 characters")
      .regex(
        /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*./%|?><]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {
          message:
            "Password must contain uppercase letter, lowercase letter, a number, and a special character (!@#$%^&*./%|?><)",
        }
      ),
  }),
});
export type ChangePasswordInput = typeof changePasswordSchema._type["body"];

export const resetPasswordSchema = object({
  body: object({
    token: string({
      required_error: "token is required",
    }),
    newPassword: string({
      required_error: "New password is required",
    })
      .min(8, "New Password should not be less than 8 characters")
      .regex(
        /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*./%|?><]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {
          message:
            "Password must contain uppercase letter, lowercase letter, a number, and a special character (!@#$%^&*./%|?><)",
        }
      ),
  }),
});
export type resetPasswordInput = typeof resetPasswordSchema._type["body"];

