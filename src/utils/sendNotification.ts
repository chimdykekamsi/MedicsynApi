 import webpush from "web-push"; //remember to install this package later after fixing merge conflict
import NotificationRepo from "../database/repository/notificationRepo";

// VAPID Keys
const vapidKeys = {
    publicKey: "BCh3RulGWITUMRzHpxZlOQWCdS9-li7XC8rA8J-OESjq99jdHmAzKN2rc6jbn2wbE57FHBQmFpphPxn1SJDXcrs",
    privateKey: "9Mz4DDXcbV7bdElR8k9FPGn95u0B9k2DSs5kQOdugFs",
};

// Setting up VAPID details
 webpush.setVapidDetails("mailto:myuserid@email.com", vapidKeys.publicKey, vapidKeys.privateKey);//remeber to uncomment this after installing the page

/**
 * Sends push notifications to all subscribed devices for a user.
 * @param userId - ID of the user.
 * @param payload - Notification payload.
 */
const sendNotificationsToUser = async (userId: string, payload: string) => {
    const userNotification = await NotificationRepo.findNotificationByUserId(userId);
    if (!userNotification || userNotification.subscription.length === 0) return;

    // Loop through all subscriptions and send notifications
    const validSubscriptions = [];
    for (const subscription of userNotification.subscription) {
        try {
             await webpush.sendNotification(subscription, payload);//remember to uncomment this after insalling the package
            validSubscriptions.push(subscription); // Keep valid subscriptions
        } catch (error: any) {
            console.error("Error sending notification:", error);
            if (error.statusCode !== 410 && error.statusCode !== 404) {
                // If the error is not about expired subscriptions, rethrow it
                throw error;
            }
        }
    }

    // Update subscriptions if any expired
    if (validSubscriptions.length !== userNotification.subscription.length) {
        userNotification.subscription = validSubscriptions;
        await userNotification.save();
    }
};

export default sendNotificationsToUser;
