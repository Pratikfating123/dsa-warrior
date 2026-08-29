import jwt from "jsonwebtoken";
import {env} from "../config/env.js";

export function signToken(user){return jwt.sign({sub:String(user._id),role:user.role},env.jwtSecret,{expiresIn:"7d"});}
export function levelFromXp(xp){return Math.floor(xp/250)+1;}
export function xpIntoLevel(xp){return xp%250;}
export function publicUser(user){
  return {
    id:String(user._id),name:user.name,email:user.email,role:user.role,
    xp:user.xp,coins:user.coins,streak:user.streak,
    solvedChallenges:user.solvedChallenges||[],achievements:user.achievements||[],
    createdAt:user.createdAt
  };
}
