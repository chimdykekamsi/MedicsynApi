import { Request, Response } from "express";
import NotificationRepo from "../../../database/repository/notificationRepo";
import APIResponse from "../../../utils/api";
import sendNotificationsToUser from "../../../utils/sendNotification";

const sendNotificationHandler = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user._id;
    const { time = "00:00" } = req.query;

    const notification = await NotificationRepo.findNotificationByUserId(userId);
    const subscription = notification?.subscription;
    if (!notification || !subscription) {
      throw new Error("User is not subscribed to notifications");
    }

    const medications = await NotificationRepo.getMedicationsForTime(userId, time.toString());
    if (!medications) throw new Error("No medication found for this time");

    const data = {
        message: "Time for your meds",
        data: { medications }
    };

    // 🔹 Fix: Await sendNotification
    await sendNotificationsToUser(userId, JSON.stringify(data));

    // 🔹 Fix: Update medications one by one in parallel
    await Promise.all(
      medications.map(medication =>
        NotificationRepo.updateMedicationNotification(userId, medication.id)
      )
    );

    return APIResponse.success("Medications sent", undefined, 200).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default sendNotificationHandler;
