import mongoose from "mongoose";
import { TUserRole } from "../users/user_interface";

export type TLoginUser = {
  email: string;
  password: string;
};

export type TJwtPayload = {
  user_id: mongoose.Types.ObjectId;
  role: TUserRole;
};
