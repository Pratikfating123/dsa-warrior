import {z} from "zod";
import {createChallenge} from "../services/store.js";
const schema=z.object({
 slug:z.string().min(2),topicId:z.string().min(2),title:z.string().min(2),description:z.string().min(2),
 difficulty:z.enum(["Easy","Medium","Hard"]),xp:z.number().int().positive(),starterCode:z.string(),
 language:z.string(),examples:z.array(z.string()).default([]),hints:z.array(z.string()).default([]),
 keywords:z.array(z.string()).default([]),
 testCases:z.array(z.object({input:z.string(),expectedOutput:z.string(),hidden:z.boolean().default(false)})),
 order:z.number().int().default(99)
});
export async function create(req,res){const d=schema.parse(req.body);res.status(201).json({challenge:await createChallenge(d)});}
