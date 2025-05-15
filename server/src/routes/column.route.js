import { Router } from "express";
import * as ctrl from "../controllers/column.controller.js";

const router = Router({ mergeParams: true });

router.get("/", ctrl.getColumns);
router.post("/", ctrl.createColumn);
router.post("/positions", ctrl.updateColumnPositions);
router.post("/:columnId", ctrl.updateColumn);
router.delete("/:columnId", ctrl.deleteColumn);

export default router;
