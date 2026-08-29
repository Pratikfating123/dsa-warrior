import {Router} from "express";
import {getChallenges,getChallenge} from "../controllers/challengeController.js";
const r=Router();r.get("/",getChallenges);r.get("/:id",getChallenge);export default r;
