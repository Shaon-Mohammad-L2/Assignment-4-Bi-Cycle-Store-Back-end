import mongoose, { Types } from "mongoose";
import { ClientModel, TClient } from "./client_interface";
import { User } from "../users/user_model";

const ClientSchema = new mongoose.Schema<TClient, ClientModel>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is required!"],
      index: false,
      ref: "User",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    picture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
// statics method for search client in db.
ClientSchema.statics.isExistClientInDBFindBy_user = async function (
  user: string
) {
  return await Client.findOne({ user });
};
// user and client information.
ClientSchema.statics.isUserAndClientInformationFindBy_id = async function (
  _id: Types.ObjectId
) {
  const user = await User.isUserBlockedOrDeletedFindBy_id(_id);
  const client = await Client.findById(_id);
  return { user, client };
};
export const Client = mongoose.model<TClient, ClientModel>(
  "Client",
  ClientSchema
);
