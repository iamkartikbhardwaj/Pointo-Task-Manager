import { Router } from "express";
import * as ctrl from "../controllers/project.controller.js";

const router = Router();

router.get("/", ctrl.getProjects);
router.post("/", ctrl.createProject);
router.get("/:id", ctrl.getProject);
router.post("/:id", ctrl.updateProject);
router.delete("/:id", ctrl.deleteProject);

export default router;
