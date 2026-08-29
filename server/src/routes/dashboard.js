import {Router} from "express";
import {auth} from "../middleware/auth.js";
import {dashboard,profile} from "../controllers/dashboardController.js";
const r=Router();r.get("/",auth,dashboard);r.get("/profile",auth,profile);r.get("/daily-challenge",auth,dashboard);export default r;
