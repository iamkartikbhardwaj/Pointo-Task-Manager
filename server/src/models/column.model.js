import mongoose, { Schema } from "mongoose";

const columnSchema = new Schema({
  title: { type: String, required: true, trim: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  position: { type: Number, required: true },
});

export default mongoose.model("Column", columnSchema);
