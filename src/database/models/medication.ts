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
  export class Medication {
    @prop({ required: true })
    name!: string;
  
    @prop({ required: true })
    dosage!: string;
  
    // How many days interval
    @prop({ required: true })
    daysInterval!: number;
  
    // Daily will hold an array of time strings
    @prop({ required: true})
    dailySchedule!: string[];
  
    @prop()
    prescription?: string;

    @prop({
      required: true,
      type: () => mongoose.Schema.Types.ObjectId,
      ref: "User"
    })
    userId!: string;
    
  
    @prop()
    message?: string;
  }
  
  const MedicationModel = getModelForClass(Medication);
  export default MedicationModel;  