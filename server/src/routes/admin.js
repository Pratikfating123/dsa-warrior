import {Router} from "express";
import {auth,adminOnly} from "../middleware/auth.js";
import {create} from "../controllers/adminController.js";
const r=Router();r.post("/challenges",auth,adminOnly,create);export default r;
