// src/models/Task.js
import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    columnId: { type: Schema.Types.ObjectId, ref: "Column", required: true },
    position: { type: Number, required: true },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
