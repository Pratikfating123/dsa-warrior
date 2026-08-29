import bcrypt from "bcryptjs";
import {connectDatabase} from "../config/db.js";
import User from "../models/User.js";
import Challenge from "../models/Challenge.js";
import {challenges} from "./challenges.js";
import {seedMemory,isMemory} from "../services/store.js";

await connectDatabase();

if(isMemory()){
  seedMemory({challenges,users:[
    {_id:"demo-user",name:"Demo Adventurer",email:"demo@dsaquest.local",passwordHash:await bcrypt.hash("Demo123!",12),role:"user",xp:350,coins:150,streak:3,lastActiveDate:"",solvedChallenges:["find-maximum"],achievements:["first-blood"]},
    {_id:"admin-user",name:"Quest Admin",email:"admin@dsaquest.local",passwordHash:await bcrypt.hash("Admin123!",12),role:"admin",xp:0,coins:100,streak:0,lastActiveDate:"",solvedChallenges:[],achievements:[]}
  ]});
}else{
  await Challenge.deleteMany({});
  await Challenge.insertMany(challenges);
  const users=[
    {name:"Demo Adventurer",email:"demo@dsaquest.local",passwordHash:await bcrypt.hash("Demo123!",12),role:"user",xp:350,coins:150,streak:3,solvedChallenges:["find-maximum"],achievements:["first-blood"]},
    {name:"Quest Admin",email:"admin@dsaquest.local",passwordHash:await bcrypt.hash("Admin123!",12),role:"admin",xp:0,coins:100,streak:0,solvedChallenges:[],achievements:[]}
  ];
  for(const u of users)await User.findOneAndUpdate({email:u.email},u,{upsert:true,new:true,setDefaultsOnInsert:true});
}
console.log("Seed complete.");process.exit(0);
