import { Request, Response } from "express";
import Rubric from "@/schema/rubrics";
import { Rubric as I_Rubric } from "@/types/rubric";
import { findUserByEmail } from "@/services/dbService";

export async function createRubric(req: Request, res: Response) {
  const rubric: I_Rubric = req.body;
  const createdBy = req.user?.email;

  if (!createdBy || !rubric) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }

  try {
    // fetch createdBy id from database
    const createdById = await findUserByEmail(createdBy);

    if (!createdById) {
      throw new Error("User not found");
    }
    rubric.createdBy = createdById._id;

    const newRubric = await Rubric.create(rubric);

    res
      .status(201)
      .json({ message: "Rubric created successfully", rubric: newRubric });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
}

export async function getRubrics(req: Request, res: Response) {
  const rubric_id = req.params.id;
  if (!rubric_id) {
    res.status(400).json({ error: "Invalid Rubric Id" });
    return;
  }

  try {
    const rubrics = await Rubric.find({ _id: rubric_id });
    if (!rubrics || rubrics.length === 0) {
      res.status(404).json({ error: "Rubric not found" });
      return;
    }

    res.status(200).json(rubrics);
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
}
