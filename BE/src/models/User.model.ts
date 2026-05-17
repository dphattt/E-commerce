import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Định nghĩa type cho document
interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  comparePassword(plain: string): Promise<boolean>;
}

// Định nghĩa type cho static methods
interface IUserModel extends Model<IUser> {
  hashPassword(plain: string): Promise<string>;
}

const userSchema = new Schema<IUser, IUserModel>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, trim: true, default: "" },
  },
  { timestamps: true, collection: "users" },
);

// Instance method
userSchema.methods.comparePassword = function (plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.passwordHash);
};

// Static method
userSchema.statics.hashPassword = async function (plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;