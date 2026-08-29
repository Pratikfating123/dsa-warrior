import mongoose from "mongoose";
import {env} from "./env.js";

export async function connectDatabase(){
  if(!env.mongoUri){
    console.log("MongoDB URI not configured. Running in-memory development mode.");
    return false;
  }
  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");
  return true;
}
