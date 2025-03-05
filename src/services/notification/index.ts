import {Router} from "express";
import suscribeToNotificationHandler from "./handlers/suscribe"; 
import addMedicationHandler from "./handlers/addMedication"; 
import sendNotificationHandler from "./handlers/pushNotification";
import authenticateUser from "../../middleware/authenticateUser";
import deserialize from "../../middleware/deserialize";

const notificationRoutes = Router();

// Subscribe a user (requires authentication)
notificationRoutes.post("/subscribe", deserialize, authenticateUser, suscribeToNotificationHandler);

// Add a medication to a user (requires authentication)
notificationRoutes.post("/add-medication", deserialize, authenticateUser, addMedicationHandler);

notificationRoutes.get("/send-notification", deserialize, authenticateUser, sendNotificationHandler);

notificationRoutes.get("/get-schedule", deserialize, authenticateUser, sendNotificationHandler);

export default notificationRoutes;