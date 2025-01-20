import { DocumentType } from "@typegoose/typegoose";
import UserModel, { User } from "../models/user";

export default class UserRepo {
  static createUser: (
    user: Omit<User, "verifyPassword" | "privateFields" | "role">
  ) => Promise<User> = async (user) => {
    return await UserModel.create(user);
  };

  static countUsers: () => Promise<number> = async () => {
      return await UserModel.countDocuments();
  }

  static findByEmail: (
    email: string
  ) => Promise<DocumentType<User> | null> = async (email) => {
    return await UserModel.findOne({ email });
  };

  static updateUser: (
    updateParams: Partial<User>,
    id: string
  ) => Promise<Omit<User, "password"> | null> = async (updateParams, id) => {
    const { password, ...rest } = updateParams;
    const user = await this.findById(id);
    if (!user) return null;
    if (password) {
      user.password = password;
      user.save();
    }
    await UserModel.findByIdAndUpdate(id, rest);
    return rest as User;
  };

  static findById = async (id: string) => {
    return await UserModel.findById(id);
  };

  static findByResetToken = async (passwordResetToken: string) => {
    const now = new Date();
    return await UserModel.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: now },
    });
  };
  
  static findAll = async (limit: number, page: number) => {
    return await UserModel.find()
    .skip((page - 1) * limit)
    .limit(limit);
  };

  static deleteUser = async (id: string) => {
    return await UserModel.findByIdAndDelete(id);
  };
}
