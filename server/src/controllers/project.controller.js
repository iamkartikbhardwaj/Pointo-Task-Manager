import { Project } from "../models/project.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required.");
  }

  const existingProject = await Project.findOne({ title });

  if (existingProject) {
    throw new apiError(409, "Project with this title already exists.");
  }

  const project = await Project.create({
    title,
    description,
  });

  return res
    .status(200)
    .json(new apiResponse(200, project, "Project created successfully."));
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find();
  return res
    .status(200)
    .json(new apiResponse(200, projects, "Projects fetched successfully."));
});

export { createProject, getProjects };
