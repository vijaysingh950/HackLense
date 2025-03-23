import { Router } from "express";
import { createRubric, getRubrics } from "@/controllers/rubrics";

const router = Router();

router.post("/", createRubric);

router.get("/:id", getRubrics);

export default router;
