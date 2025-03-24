import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  subject: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  parameters: [
    {
      name: String,
      pirority: Number,
    },
  ],
  keywords: [
    {
      name: String,
      priority: Number,
    },
  ],
  submissions: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model("events", EventSchema);

export default Event;
