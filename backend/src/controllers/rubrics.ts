import Keyword from "@/schema/keywords";
import Parameter from "@/schema/parameters";
import Rubric from "@/schema/rubrics";
import User from "@/schema/users";
import { Request, Response } from "express";
import { Types } from "mongoose";

export const rubricCreate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, parameters, keywords, createdBy } = req.body;

        // Validate required fields
        if (!title || !createdBy) {
            res.status(400).json({ error: "Title and CreatedBy are required" });
            return;
        }

        // createdBy is considered to be username
        const createdByUser = await User.findOne({ username: createdBy });
        if (!createdByUser) {
            res.status(404).json({ error: "CreatedBy user not found" });
            return;
        }

        let parameterIds: Types.ObjectId[] = [];
        if (Array.isArray(parameters) && parameters.length > 0) {
            const createdParams = await Parameter.insertMany(
                parameters.map(param => ({
                    name: param.name,
                    description: param.description,
                    weight: param.weight,
                    status: param.status || "active",
                    createdBy: createdByUser._id
                }))
            );
            parameterIds = createdParams.map(param => param._id);
        }

        let keywordIds: Types.ObjectId[] = [];
        if (Array.isArray(keywords) && keywords.length > 0) {
            const createdKeywords = await Keyword.insertMany(
                keywords.map(keyword => ({
                    name: keyword.name,
                    weight: keyword.weight,
                    category: keyword.category,
                    createdBy: createdByUser._id
                }))
            );
            keywordIds = createdKeywords.map(keyword => keyword._id);
        }

        // Create a new rubric instance
        const newRubric = new Rubric({
            title,
            description,
            parameters: parameterIds,
            keywords: keywordIds,
            createdBy: createdByUser._id
        });

        // Save the rubric to the database
        const savedRubric = await newRubric.save();
        if (!savedRubric) {
            res.status(500).json({ error: "Failed to save rubric" });
            return;
        }
        res.status(201).json({ message: "Rubric created successfully", rubric: savedRubric });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log(error);
    }
    return;
};
