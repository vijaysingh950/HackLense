import Submission from "@/schema/submissions";
import { Request, Response } from "express";
import { Submission as SubmissionInterface } from "@/types/submission";
import Event from "@/schema/events";
import { updateEventSubmission } from "@/controllers/event";

export async function createSubmission(req: Request, res: Response) {
  const submission: SubmissionInterface = req.body;
  if (
    !submission.student ||
    !submission.title ||
    !submission.description ||
    !submission.fileURL ||
    !submission.submittedAt
  ) {
    res.status(400).json({ message: "Missing Fields" });
    return;
  }

  try {
    // validate event
    if (!submission.event) {
      res.status(400).json({ message: "Event ID is required" });
      return;
    }

    const eventExists = await Event.findById(submission.event);
    if (!eventExists) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const newSubmission = await Submission.create(submission);
    const updatedEvent = await updateEventSubmission(submission.event);
    if (!newSubmission || !updatedEvent) {
      throw new Error("Error in creating submission");
      return;
    }
    res.status(201).json(newSubmission);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error in creating submission" });
    return;
  }
}

export async function getSubmissions(req: Request, res: Response) {
  try {
    const submissions = await Submission.find({});
    res.status(200).json(submissions);
    return;
  } catch (error) {
    res.status(404).json({ message: "Error in fetching submissions" });
    return;
  }
}
