import { Router } from "express";
import { rubricCreate } from "@/controllers/rubrics";

const router = Router();

router.post("/", rubricCreate); // Create a new rubric

export default router;
