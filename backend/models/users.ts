import mongoose from "mongoose";

export interface IUserCreate {
  name: string
  email: string
  password: string
}
export interface IUser extends IUserCreate {
  _id: mongoose.Types.ObjectId,
}

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true, maxLength: 50, minlength: 3 },
  password: { type: String, required: true, maxLength: 100, minlength: 5 },
  name: { type: String, required: true, maxLength: 50, minlength: 1 },
})

const User = mongoose.model<IUser>("User", userSchema);
export default User;