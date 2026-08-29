import {listChallenges,findChallenge} from "../services/store.js";
export async function getChallenges(req,res){
  const cs=await listChallenges(req.query.topic);
  res.json({challenges:cs.map(c=>({id:c.slug||String(c._id),topicId:c.topicId,title:c.title,description:c.description,difficulty:c.difficulty,xp:c.xp,examples:c.examples,order:c.order}))});
}
export async function getChallenge(req,res){
  const c=await findChallenge(req.params.id);
  if(!c)return res.status(404).json({message:"Challenge not found"});
  res.json({challenge:{id:c.slug||String(c._id),topicId:c.topicId,title:c.title,description:c.description,difficulty:c.difficulty,xp:c.xp,starterCode:c.starterCode,language:c.language,examples:c.examples,hints:c.hints,testCases:(c.testCases||[]).filter(t=>!t.hidden)}});
}
