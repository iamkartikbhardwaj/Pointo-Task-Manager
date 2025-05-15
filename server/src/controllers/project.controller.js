import Project from "../models/project.model.js";
import Column from "../models/column.model.js";
import Task from "../models/task.model.js";
import apiError from "../utils/apiError.js";
import catchAsync from "../utils/catchAsync.js";

// GET /api/v1/projects
export const getProjects = catchAsync(async (req, res) => {
  const list = await Project.find();
  res.json({ success: true, data: list, message: "Projects fetched." });
});

// POST /api/v1/projects
export const createProject = catchAsync(async (req, res) => {
  const { title, description } = req.body;

  if (!title) throw new apiError(400, "Title is required");

  if (await Project.exists({ title })) throw new apiError(409, "Title exists");

  const proj = await Project.create({ title, description });

  await Column.create({
    projectId: proj._id,
    title: "Backlog",
    position: 0,
  });

  res.status(201).json({ success: true, data: proj, message: "Created." });
});

// GET /api/v1/projects/:id
export const getProject = catchAsync(async (req, res) => {
  const proj = await Project.findById(req.params.id);
  if (!proj) throw new apiError(404, "Not found");
  res.json({ success: true, data: proj });
});

// PATCH /api/v1/projects/:id
export const updateProject = catchAsync(async (req, res) => {
  const { title, description } = req.body;
  const proj = await Project.findById(req.params.id);
  if (!proj) throw new apiError(404, "Not found");
  proj.title = title ?? proj.title;
  proj.description = description ?? proj.description;
  await proj.save();
  res.json({ success: true, data: proj, message: "Updated." });
});

// DELETE /api/v1/projects/:id
export const deleteProject = catchAsync(async (req, res) => {
  const proj = await Project.findById(req.params.id);
  if (!proj) throw new apiError(404, "Project not found");

  await Task.deleteMany({ projectId: proj._id });

  await Column.deleteMany({ projectId: proj._id });

  await proj.deleteOne();

  res.json({ success: true, message: "Deleted." });
});
