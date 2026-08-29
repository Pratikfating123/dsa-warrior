import {Router} from "express";
import {auth} from "../middleware/auth.js";
import {submit,mySubmissions} from "../controllers/submissionController.js";
const r=Router();r.post("/",auth,submit);r.get("/my",auth,mySubmissions);export default r;
