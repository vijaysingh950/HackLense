import { Router } from "express";
import { rubricCreate, rubricGet, rubricDelete } from "@/controllers/rubrics";

const router = Router();

router.post("/", rubricCreate); // Create a new rubric

router.get("/:id", rubricGet); // Get a rubric by ID

router.delete("/:id", rubricDelete); // Delete a rubric by ID

export default router;
