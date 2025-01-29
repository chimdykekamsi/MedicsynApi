import {
    DocumentType,
    getModelForClass,
    modelOptions,
    prop,
    Severity,
  } from "@typegoose/typegoose";
  import mongoose from "mongoose";
  
  @modelOptions({
    schemaOptions: {
      timestamps: true,
    },
    options: {
      allowMixed: Severity.ALLOW,
    },
  })
  export class Notification {
    @prop({ required: true })
    deviceToken!: string;
  
    @prop({ required: true })
    utcTime!: string;
  
    @prop({ required: true})
    userTimeZone!: string;

    @prop({
      required: true,
      type: () => mongoose.Schema.Types.ObjectId,
      ref: "User"
    })
    userId!: string;

    @prop({
      required: true,
      type: () => mongoose.Schema.Types.ObjectId,
      ref: "Medication"
    })
    medicationId!: string;
    
  }
  
  const NotificationModel = getModelForClass(Notification);
  export default NotificationModel;  