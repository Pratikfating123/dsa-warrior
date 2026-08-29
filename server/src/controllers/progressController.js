import {findChallenge,saveUser} from "../services/store.js";
import {levelFromXp,publicUser} from "../utils/auth.js";

export async function progress(req,res){res.json({user:publicUser(req.user),level:levelFromXp(req.user.xp)});}
export async function hint(req,res){
  const {challengeId,index}=req.body,c=await findChallenge(challengeId);
  if(!c)return res.status(404).json({message:"Challenge not found"});
  if(!Number.isInteger(index)||index<0||index>=c.hints.length)return res.status(400).json({message:"Invalid hint"});
  if(req.user.coins<10)return res.status(400).json({message:"Not enough coins"});
  req.user.coins-=10;await saveUser(req.user);res.json({hint:c.hints[index],coins:req.user.coins});
}
