import { Request, Response } from "express";
import NotificationRepo from "../../../database/repository/notificationRepo";
import MedicationRepo from "../../../database/repository/medicationRepo";
import APIResponse from "../../../utils/api";

const addMedication = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = res.locals.user._id;
    if(!userId) return APIResponse.error("UserId is required",400).send(res);
    const {medId} = req.body;
    if(!medId) return APIResponse.error("medId is required",400).send(res);
    const medication = await MedicationRepo.findById(medId);
    if (!medication) {
      return APIResponse.error("Medication with this ID does not exist", 404).send(res);
    }
    const {daysInterval, dailySchedule, _id} = medication;
    const lastNotified = req.body.startToday === true 
      ? new Date(Date.now() - 24 * 60 * 60 * 1000) // One day ago
      : new Date(); // Current time

    const med = {
      daysInterval,
      dailySchedule,
      id: _id.toString(),
      lastNotified,
    };


    const notification = await NotificationRepo.addMedication(userId,med);
    return APIResponse.success("Medication added successfully", {notification}, 200).send(res)
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};
export default addMedication;
