import { Request, Response } from "express";
import MedicationRepo from "../../../database/repository/medicationRepo";
import APIResponse from "../../../utils/api";
import { formatResponseRecord } from "../../../utils/formatters";
import { UpdateMedicationInput } from "../../../validationSchema/medication";

export const updateMedicationsHandler = async (
  req: Request<{ medId: string }, {}, UpdateMedicationInput>,
  res: Response
) => {
  try {
    const { medId } = req.params;
    const userId = res.locals.user._id;

    // Check if the medication exists
    const medication = await MedicationRepo.findById(medId);
    if (!medication) {
      return APIResponse.error("Medication with this ID does not exist", 404).send(res);
    }

    if (medication.userId.toString() !== String(userId)) {
      return APIResponse.error("You don't have permission to perform this task", 403).send(res);
    }

    // Update the medication
    const updatedMedication = await MedicationRepo.updateMedication(req.body, medId);
    if (!updatedMedication) {
      return APIResponse.error(
        "We couldn't update the medication at this time. Please try again later.",
        500
      ).send(res);
    }

    // Send success response
    return APIResponse.success("Medication updated successfully", {
      medication: updatedMedication,
    }).send(res);
  } catch (error) {
    console.error("Error updating medication:", error);
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};