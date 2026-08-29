import mongoose from "mongoose";

const schema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
      },

      challengeId: {
        type: String,
        required: true,
        index: true
      },

      language: {
        type: String,
        required: true
      },

      code: {
        type: String,
        required: true
      },

      status: {
        type: String,
        required: true
      },

      passed: {
        type: Number,
        default: 0
      },

      total: {
        type: Number,
        default: 0
      },

      executionTime: {
        type: String,
        default: null
      },

      memory: {
        type: String,
        default: null
      },

      stdout: {
        type: String,
        default: null
      },

      stderr: {
        type: String,
        default: null
      },

      compileOutput: {
        type: String,
        default: null
      }
    },

    {
      timestamps: true
    }
  );

export default mongoose.model(
  "Submission",
  schema
);