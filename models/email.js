import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    to: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Email = mongoose.model("Email", emailSchema);
export default Email;
