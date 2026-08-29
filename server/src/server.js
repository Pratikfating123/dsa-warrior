import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import {connectDatabase} from "./config/db.js";
import {env} from "./config/env.js";
import authRoutes from "./routes/auth.js";
import challengeRoutes from "./routes/challenges.js";
import progressRoutes from "./routes/progress.js";
import submissionRoutes from "./routes/submissions.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import adminRoutes from "./routes/admin.js";
import dashboardRoutes from "./routes/dashboard.js";
import {errorHandler} from "./middleware/error.js";

const app=express();

async function start(){
  try{
    await connectDatabase();
    app.use(cors({origin:true,credentials:true,methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],allowedHeaders:["Content-Type","Authorization"]}));
    app.use(helmet());
    app.use(express.json({limit:"100kb"}));
    app.use(rateLimit({windowMs:15*60*1000,max:300,standardHeaders:true,legacyHeaders:false}));
    app.get("/api/health",(req,res)=>res.json({ok:true,service:"dsa-quest-api",message:"Backend is running"}));
    app.use("/api/auth",authRoutes);
    app.use("/api/challenges",challengeRoutes);
    app.use("/api/progress",progressRoutes);
    app.use("/api/submissions",submissionRoutes);
    app.use("/api/leaderboard",leaderboardRoutes);
    app.use("/api/admin",adminRoutes);
    app.use("/api/dashboard",dashboardRoutes);
    app.use(errorHandler);
    app.listen(env.port,"0.0.0.0",()=>console.log(`DSA Quest API running on http://localhost:${env.port}`));
  }catch(e){console.error("SERVER STARTUP ERROR",e);process.exit(1);}
}
start();
