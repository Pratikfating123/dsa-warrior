import {Router} from "express";
import {getLeaderboard} from "../controllers/leaderboardController.js";
const r=Router();r.get("/",getLeaderboard);export default r;
