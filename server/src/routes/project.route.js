import { Router } from "express";
import {
  createProject,
  getProjects,
} from "../controllers/project.controller.js";
const router = Router();

router.route("/").post(createProject);
router.route("/").get(getProjects);

export default router;
