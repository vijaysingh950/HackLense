import { Request, Response } from "express";
import Event from "@/schema/events";
import { Event as EventInterface } from "@/types/event";
import Rubric from "@/schema/rubrics";
import { findUserByEmail } from "@/services/dbService";

export async function createEvent(req: Request, res: Response) {
  const event: EventInterface = req.body;

  console.log(event);

  if (
    !event.title ||
    !event.description ||
    !event.startDate ||
    !event.endDate ||
    !event.rubric ||
    !event.createdBy
  ) {
    res.status(400).json({ message: "Missing Fields" });
    return;
  }

  event.submissions = 0;

  try {
    // checking if rubric exists
    const rubric = await Rubric.findById(event.rubric);
    if (!rubric || rubric === null) {
      res.status(404).json({ message: "Rubric not found" });
      return;
    }

    // checking if createdBy exists
    const createdBy = await findUserByEmail(event.createdBy);
    if (!createdBy || createdBy === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    event.createdBy = createdBy._id;

    const newEvent = await Event.create(event);
    if (!newEvent || newEvent === null) {
      throw new Error("Error in event creation");
    }
    res.status(201).json({ message: "Event created successfully" });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error in event creation" });
    return;
  }
}

export async function getEvents(req: Request, res: Response) {
  try {
    const events: EventInterface[] = await Event.find({});
    res.status(200).json(events);
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error in fetching events" });
    return;
  }
}

export async function updateEventSubmission(req: Request, res: Response) {
  const eventId: string = req.params.id;

  if (!eventId || eventId === null) {
    res.status(400).json({ message: "Missing Event Id" });
    return;
  }

  try {
    const event = await Event.findById(eventId);
    if (!event || event === null) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    event.submissions += 1;
    await event.save();
    res.status(200).json({ message: "Event submission updated successfully" });
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error in updating event submission" });
    return;
  }
}
