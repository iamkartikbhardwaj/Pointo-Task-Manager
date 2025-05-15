import { Router } from "express";
import * as ctrl from "../controllers/task.controller.js";

const router = Router({ mergeParams: true });

router.get("/", ctrl.getTasks);
router.post("/", ctrl.createTask);
router.post("/positions", ctrl.updateTaskPositions);
router.post("/:taskId", ctrl.updateTask);
router.delete("/:taskId", ctrl.deleteTask);

export default router;
