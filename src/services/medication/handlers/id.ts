import { Request, Response } from "express";
import MedicationRepo from "../../../database/repository/medicationRepo";
import { formatResponseRecord } from "../../../utils/formatters";
import APIResponse from "../../../utils/api";

export const findMedicationByIdHandler = async (req: Request, res: Response) => {
  try {
    const { medId } = req.params;
    const userId = res.locals.user._id;
    const medication = await MedicationRepo.findById(medId);
    if (!medication) {
      return APIResponse.error("Medication with this ID does not exist", 404).send(res);
    }

    if (medication.userId.toString() !== String(userId)) {
      return APIResponse.error("You don't have permission to perform this task", 403).send(res);
    }
    const response = formatResponseRecord(medication.toObject());
    response.userId = medication.userId.toString();


    // Send response with users and pagination
    return APIResponse.success(
      "Fetching medication with id " + req.params.medId,
      {medication: response},
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export const deleteMedicationHandler = async (req: Request, res: Response)=> {
  try {
    const { medId } = req.params;
    const userId = res.locals.user._id;
    const medication = await MedicationRepo.findById(medId);
    if (!medication) {
      return APIResponse.error("Medication with this ID does not exist", 404).send(res);
    }

    if (medication.userId.toString() !== String(userId)) {
      return APIResponse.error("You don't have permission to perform this task", 403).send(res);
    }

    await MedicationRepo.deleteMedication(medId);

    // Send response with users and pagination
    return APIResponse.success(
      "Deleting medication",
      undefined,
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
}