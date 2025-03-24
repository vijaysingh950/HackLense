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
    !event.subject ||
    !event.startDate ||
    !event.endDate ||
    !event.parameters
  ) {
    res.status(400).json({ message: "Missing Fields" });
    return;
  }

  event.submissions = 0;

  try {
    // Fetching createdBy from the cookie
    const createdBy = req?.user?.email;
    if (!createdBy || createdBy === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    console.log("createdBy", createdBy);

    const user = await findUserByEmail(createdBy);

    if (!user || user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    event.createdBy = user._id;

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

export async function updateEventSubmission(eventId: string): Promise<String> {
  if (!eventId) {
    return Promise.reject("Missing Event Id");
  }

  try {
    const event = await Event.findById(eventId);
    if (!event || event === null) {
      return Promise.reject("Event not found");
    }

    event.submissions += 1;
    await event.save();
    return Promise.resolve("Event submission updated successfully");
  } catch (error) {
    return Promise.reject("Error in updating event submission");
  }
}
