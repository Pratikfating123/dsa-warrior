import {Router} from "express";
import {auth} from "../middleware/auth.js";
import {progress,hint} from "../controllers/progressController.js";
const r=Router();r.get("/",auth,progress);r.post("/hint",auth,hint);export default r;
