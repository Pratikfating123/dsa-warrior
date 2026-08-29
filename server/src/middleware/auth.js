import jwt from "jsonwebtoken";
import {env} from "../config/env.js";
import {findUserById} from "../services/store.js";

export async function auth(req,res,next){
  try{
    const h=req.headers.authorization||"";
    const token=h.startsWith("Bearer ")?h.slice(7):null;
    if(!token)return res.status(401).json({message:"Authentication required"});
    const payload=jwt.verify(token,env.jwtSecret);
    const user=await findUserById(payload.sub);
    if(!user)return res.status(401).json({message:"User not found"});
    req.user=user;next();
  }catch{res.status(401).json({message:"Invalid or expired token"});}
}
export function adminOnly(req,res,next){
  if(req.user?.role!=="admin")return res.status(403).json({message:"Admin access required"});
  next();
}
