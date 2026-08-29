import {leaderboard} from "../services/store.js";
import {levelFromXp} from "../utils/auth.js";
export async function getLeaderboard(req,res){
  const rows=await leaderboard();
  res.json({leaderboard:rows.map((u,i)=>({rank:i+1,name:u.name,xp:u.xp,level:levelFromXp(u.xp),achievements:u.achievements?.length||0}))});
}
