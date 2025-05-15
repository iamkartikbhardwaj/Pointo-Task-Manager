import Column from "../models/column.model.js";
import Task from "../models/task.model.js";
import apiError from "../utils/apiError.js";
import catchAsync from "../utils/catchAsync.js";

// GET /api/v1/projects/:projectId/columns
export const getColumns = catchAsync(async (req, res) => {
  const cols = await Column.find({ projectId: req.params.projectId }).sort(
    "position"
  );
  res.json({ success: true, data: cols });
});

// POST /api/v1/projects/:projectId/columns
export const createColumn = catchAsync(async (req, res) => {
  const { title } = req.body;
  if (!title) throw new apiError(400, "Title required");
  const position = await Column.countDocuments({
    projectId: req.params.projectId,
  });
  const col = await Column.create({
    projectId: req.params.projectId,
    title,
    position,
  });
  res.status(201).json({ success: true, data: col });
});

// PATCH /api/v1/projects/:projectId/columns/positions
export const updateColumnPositions = catchAsync(async (req, res) => {
  const list = req.body.columns;
  if (!Array.isArray(list)) throw new apiError(400, "Invalid payload");
  await Promise.all(
    list.map(({ _id, position }) => Column.findByIdAndUpdate(_id, { position }))
  );
  res.json({ success: true, message: "Positions updated." });
});

// PATCH /api/v1/projects/:projectId/columns/:columnId
export const updateColumn = catchAsync(async (req, res) => {
  const { title, position } = req.body;
  const col = await Column.findOne({
    _id: req.params.columnId,
    projectId: req.params.projectId,
  });
  if (!col) throw new apiError(404, "Not found");
  if (title) col.title = title;
  if (position != null) col.position = position;
  await col.save();
  res.json({ success: true, data: col, message: "Updated." });
});

// DELETE /api/v1/projects/:projectId/columns/:columnId
export const deleteColumn = catchAsync(async (req, res) => {
  const col = await Column.findOne({
    _id: req.params.columnId,
    projectId: req.params.projectId,
  });
  if (!col) throw new apiError(404, "Column not found");

  const taskCount = await Task.countDocuments({ columnId: col._id });
  if (taskCount > 0) {
    throw new apiError(
      409,
      "Cannot delete column while it still contains tasks"
    );
  }

  await col.deleteOne();

  const remaining = await Column.find({ projectId: req.params.projectId }).sort(
    "position"
  );
  for (let i = 0; i < remaining.length; i++) {
    remaining[i].position = i;
    await remaining[i].save();
  }

  res.json({ success: true, message: "Column deleted." });
});
