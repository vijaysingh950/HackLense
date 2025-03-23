import mongoose, { Schema } from "mongoose";

const RubricSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    minLength: 3,
    maxlength: 500,
  },
  parameters: [
    {
      name: String,
      weightage: Number,
    },
  ],
  keywords: [
    {
      type: String,
      trim: true,
      weightage: Number,
    },
  ],
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

const Rubric = mongoose.model("rubrics", RubricSchema);

export default Rubric;
