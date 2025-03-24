import { Router } from "express";
import {
  createEvent,
  getEvents,
  updateEventSubmission,
} from "@/controllers/event";

const router = Router();

router.post("/", createEvent);
router.get("/", getEvents);
// router.post("/updateSubmission/:id", updateEventSubmission);

export default router;
