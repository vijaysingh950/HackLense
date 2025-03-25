import mongoose, { Schema } from "mongoose";

const SubmissionSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileLanguage: {
    type: String,
    required: true,
  },
  fileURL: {
    type: String,
    required: true,
  },
  extractedContent: {
    type: String,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "events",
    required: true,
  },
  // scores: [
  //   {
  //     parameter: {
  //       type: Schema.Types.ObjectId,
  //       ref: "parameters",
  //       required: true,
  //     },
  //     score: {
  //       type: Number,
  //       required: true,
  //       min: 0,
  //       max: 10,
  //     },
  //   },
  // ],
  finalScore: {
    type: Number,
    min: 0,
    max: 10,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Submission = mongoose.model("submissions", SubmissionSchema);

export default Submission;
