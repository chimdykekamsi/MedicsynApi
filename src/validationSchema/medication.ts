import { object, string, number, array, TypeOf } from "zod";

// Create Medication Schema
export const createMedicationSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }).nonempty("Name cannot be empty"),

    dosage: string({
      required_error: "Dosage is required",
    }).nonempty("Dosage cannot be empty"),

    daysInterval: number({
      required_error: "Days interval is required",
    }).positive("Days interval must be a positive number"),

    dailySchedule: array(
      string()
        .regex(
          /^(?:[01]\d|2[0-3]):[0-5]\d$/,
          "Each time must be a valid 24-hour format (e.g., '08:00', '18:30')"
        )
        .nonempty("dailySchedule must contain at least one time"),
      { required_error: "dailySchedule is required" }
    ).nonempty({ message: "dailySchedule is required" }),
    prescription: string({
      required_error: "prescription is required",
    }).nonempty("prescription cannot be empty"),

    message: string().optional(),
  }),
});
export type CreateMedicationInput = TypeOf<typeof createMedicationSchema>["body"];

// Update Medication Schema
export const updateMedicationSchema = object({
  body: object({
    name: string().optional(),
    dosage: string().optional(),
    daysInterval: number().positive("Days interval must be a positive number").optional(),
    dailySchedule: array(
      string().regex(
        /^(?:[01]\d|2[0-3]):[0-5]\d$/,
        "Each time must be a valid 24-hour format (e.g., '08:00', '18:30')"
      )
    ).min(1,"dailySchedule cannot be empty").optional(),
    prescription: string().optional(),
    message: string().optional(),
  }),
});
export type UpdateMedicationInput = TypeOf<typeof updateMedicationSchema>["body"];