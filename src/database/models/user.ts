import {
    DocumentType,
    getModelForClass,
    modelOptions,
    pre,
    prop,
    Severity,
  } from "@typegoose/typegoose";
  import * as argon2 from "argon2";
  
  @modelOptions({
    schemaOptions: {
      timestamps: true,
    },
    options: {
      allowMixed: Severity.ALLOW,
    },
  })
  @pre<User>("save", async function () {
    if (!this.isModified("password")) return;
    const hash = await argon2.hash(this.password);
    this.password = hash;
    return;
  })
  export class User {
    @prop({ required: true })
    name!: string;
  
    @prop({ required: true })
    password!: string;
  
    @prop({ unique: true, required: true })
    email!: string;
  
    @prop()
    phoneNumber?: string;
  
    @prop()
    condition?: string;
  
    @prop()
    profileUrl?: string;
  
    @prop({default: false})
    emailVerified?: boolean;
  
    @prop({default: true})
    isActive?: boolean;
    
    @prop({ required: true})
    timeZone!: string;

    @prop()
    passwordResetToken?: string;
  
    @prop()
    passwordResetExpires?: Date;
  
    @prop({ required: true, enum: ["admin", "manager", "user"], default: "user" })
    role!: string;
  
    async verifyPassword(this: DocumentType<User>, candidatePassword: string) {
      try {
        return await argon2.verify(this.password, candidatePassword);
      } catch (error) {
        console.log(error);
        return false;
      }
    }

  }
  
  const UserModel = getModelForClass(User);
  export default UserModel;
  