import mongoose from "mongoose";
import { ClientModel, TClient } from "./client_interface";

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
export const Client = mongoose.model<TClient, ClientModel>(
  "Client",
  ClientSchema
);
