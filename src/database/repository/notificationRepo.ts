import { DocumentType } from "@typegoose/typegoose";
import NotificationModel, { Notification } from "../models/notification";
// import moment from "moment"; //need to install this package later after fixing merge conflict

export default class NotificationRepo {
  /**
   * Create a new notification entry.
   * @param userId - ID of the user.
   * @param medication - Array of medication details.
   * @returns The created notification document.
   */
  static async createNotification(
    data: Notification,
  ): Promise<DocumentType<Notification>> {
    return await NotificationModel.create(data);
  }

  /**
   * Add a medication to the user's notification record.
   * If the notification doesn't exist, create it with the provided medication.
   * @param userId - ID of the user.
   * @param medication - Medication details to add.
   * @returns The updated notification document.
   */
  static async addMedication(
    userId: string,
    medication: Notification["medications"][0]
  ): Promise<DocumentType<Notification>> {
    const existingNotification = await this.findNotificationByUserId(userId);

    if (!existingNotification) {
      // If notification doesn't exist, create a new one with the medication array.
      throw new Error("User has to be subscribed to add medication");
    }
    const medicationExists = existingNotification.medications.some(
        (med) => med.id === medication.id
    );

    if (medicationExists) {
        throw new Error("Medication with this ID already exists.");
    }

    // If notification exists, push the medication to the existing array.
    existingNotification.medications.push(medication);
    return await existingNotification.save();
  }

  /**
   * Remove a medication from the user's notification record.
   * If the medication exists, remove it; otherwise, return null.
   * @param userId - ID of the user.
   * @param medicationId - ID of the medication to remove.
   * @returns The updated notification document or null if medication is not found.
   */
  static async removeMedication(
    userId: string,
    medicationId: string
  ): Promise<DocumentType<Notification> | null> {
    const notification = await NotificationModel.findOne({ userId });

    if (!notification) {
      // If no notification found, return null.
      return null;
    }

    // Check if medication exists in the array before pulling.
    const medicationExists = notification.medications.some(
      (med) => med.id === medicationId
    );

    if (!medicationExists) {
      // If medication doesn't exist, return null.
      return null;
    }

    // If medication exists, pull it from the array.
    notification.medications = notification.medications.filter(
      (med) => med.id !== medicationId
    );
    return await notification.save();
  }

  /**
   * Find a notification by user ID.
   * @param userId - ID of the user.
   * @returns The notification document.
   */
  static async findNotificationByUserId(
    userId: string
  ): Promise<DocumentType<Notification> | null> {
    return await NotificationModel.findOne({ userId });
  }
  
  static async updateMedicationNotification(userId: string, medicationId: string) {
    return NotificationModel.findOneAndUpdate(
      { userId, 'medications.id': medicationId },
      { $set: { 'medications.$.lastNotified': Date.now() } },
      { new: true }
    );
  }

  static async getMedicationsForTime(
    userId: string,
    currentTime: string
  ): Promise<Notification["medications"] | null> {
    const notification = await this.findNotificationByUserId(userId);
    if (!notification) {
      return null;
    }
    
    // const today = moment().startOf('day');//please don't forget to uncomment this code after installing momemt
    
    const matchingMedications = notification.medications.filter(medication => {
      if (!medication.lastNotified) return false;
      // const lastNotifiedDate = moment(medication.lastNotified).startOf('day');//remember to uncomment this code after installing moment
      // const nextDueDate = lastNotifiedDate.add(medication.daysInterval, 'days');//samething to do here
      // return medication.dailySchedule.includes(currentTime) && today.isSameOrAfter(nextDueDate);//samething to do here
    });

    return matchingMedications.length > 0 ? matchingMedications : null;
  }
}
