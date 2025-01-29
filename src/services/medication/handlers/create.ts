import { Request, Response } from "express";
import MedicationRepo from "../../../database/repository/medicationRepo";
import APIResponse from "../../../utils/api";
import { CreateMedicationInput } from "../../../validationSchema/medication";

const createMedicationHandler = async (
  req: Request<{}, {}, CreateMedicationInput>,
  res: Response
) => {
  try {
    const userId: string = res.locals.user._id;
    const medicationData = { ...req.body, userId };

    const medication = await MedicationRepo.createMedication(medicationData);

    return APIResponse.success(
      "We've added your medication. Sit back and wait for reminders.",
      { medication },
      201
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default createMedicationHandler;
