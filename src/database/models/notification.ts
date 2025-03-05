import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

class MedicationSchedule {
  @prop({ required: true })
  id!: string;

  @prop({ type: () => [String], required: true })
  dailySchedule!: string[]; // ['08:00', '20:00'] in LOCAL time

  @prop({ required: true, min: 1 })
  daysInterval!: number;

  @prop({default: Date.now()})
  lastNotified?: Date;
}

@modelOptions({ 
  schemaOptions: { collection: 'notifications' } 
})
export class Notification {
  @prop({ required: true, index: true })
  userId!: string;

  @prop({ type: () => [MedicationSchedule], _id: false })
  medications!: MedicationSchedule[];

  @prop({ required: true, default: 'UTC' })
  timeZone!: string;

  @prop({ required: true, default: [] })
  subscription!: Array<any>;

}

const NotificationModel = getModelForClass(Notification);
export default NotificationModel;