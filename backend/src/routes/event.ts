import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventTeacherSpecific,
  updateEventSubmission,
} from "@/controllers/event";

const router = Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.get("/specific", getEventTeacherSpecific);
// router.post("/updateSubmission/:id", updateEventSubmission);

export default router;
