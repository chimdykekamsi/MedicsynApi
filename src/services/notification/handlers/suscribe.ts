import { Request, Response } from "express";
import NotificationRepo from "../../../database/repository/notificationRepo";
import APIResponse from "../../../utils/api";

const suscribeToNotificationHandler = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user._id;
    const timeZone = res.locals.user.timeZone;
    const newSubscription = req.body;

    if (!newSubscription) 
      return APIResponse.error("Subscription is required", 400).send(res);

    let userNotification = await NotificationRepo.findNotificationByUserId(userId);

    if (!userNotification) {
      // Create a new notification document if none exists
      userNotification = await NotificationRepo.createNotification({
        userId,
        timeZone,
        subscription: [newSubscription],
        medications: [],
      });
    } else {
      // Prevent duplicate subscription
      const isAlreadySubscribed = userNotification.subscription.some(
        (sub) => JSON.stringify(sub) === JSON.stringify(newSubscription)
      );

      if (!isAlreadySubscribed) {
        userNotification.subscription.push(newSubscription);
        await userNotification.save();
      }
    }

    return APIResponse.success("User subscribed successfully", { userNotification }, 200).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default suscribeToNotificationHandler;
