import Task from "../models/task.model.js";
import apiError from "../utils/apiError.js";
import catchAsync from "../utils/catchAsync.js";

// GET /api/v1/projects/:projectId/tasks
export const getTasks = catchAsync(async (req, res) => {
  const list = await Task.find({ projectId: req.params.projectId }).sort(
    "position"
  );
  res.json({ success: true, data: list });
});

// POST /api/v1/projects/:projectId/tasks
export const createTask = catchAsync(async (req, res) => {
  const { columnId, title, description, dueDate } = req.body;
  if (!columnId || !title || !dueDate)
    throw new apiError(400, "Missing fields");
  const position = await Task.countDocuments({ columnId });
  const task = await Task.create({
    projectId: req.params.projectId,
    columnId,
    title,
    description,
    position,
    dueDate,
  });
  res.status(201).json({ success: true, data: task });
});

// PATCH /api/v1/projects/:projectId/tasks/positions
export const updateTaskPositions = catchAsync(async (req, res) => {
  const list = req.body.tasks;
  if (!Array.isArray(list)) throw new apiError(400, "Invalid payload");
  await Promise.all(
    list.map(({ _id, columnId, position }) =>
      Task.findByIdAndUpdate(_id, { columnId, position })
    )
  );
  res.json({ success: true, message: "Positions updated." });
});

// PATCH /api/v1/projects/:projectId/tasks/:taskId
export const updateTask = catchAsync(async (req, res) => {
  const { title, description, dueDate, columnId, position } = req.body;
  const task = await Task.findOne({
    _id: req.params.taskId,
    projectId: req.params.projectId,
  });
  if (!task) throw new apiError(404, "Not found");
  if (title) task.title = title;
  if (description) task.description = description;
  if (dueDate) task.dueDate = dueDate;
  if (columnId) task.columnId = columnId;
  if (position != null) task.position = position;
  await task.save();
  res.json({ success: true, data: task, message: "Updated." });
});

// DELETE /api/v1/projects/:projectId/tasks/:taskId
export const deleteTask = catchAsync(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.taskId,
    projectId: req.params.projectId,
  });
  if (!task) throw new apiError(404, "Not found");
  const colId = task.columnId;
  await task.deleteOne();
  // reindex:
  const remaining = await Task.find({ columnId: colId }).sort("position");
  for (let i = 0; i < remaining.length; i++) {
    remaining[i].position = i;
    await remaining[i].save();
  }
  res.json({ success: true, message: "Deleted." });
});
