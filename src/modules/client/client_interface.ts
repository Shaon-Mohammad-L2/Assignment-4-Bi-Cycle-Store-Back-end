import mongoose, { Model, Types } from "mongoose";
import { TUser } from "../users/user_interface";

export type TClient = {
  _id?: Types.ObjectId;
  email: string;
  name?: string;
  phone?: string;
  picture?: string;
};

// create interface.
export interface ClientModel extends Model<TClient> {
  isExistClientInDBFindBy_user(user: mongoose.Types.ObjectId): Promise<TClient>;
  isUserAndClientInformationFindBy_id(
    _id: mongoose.Types.ObjectId
  ): Promise<TUser & TClient>;
}
