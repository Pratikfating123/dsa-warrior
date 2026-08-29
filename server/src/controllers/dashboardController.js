import {findChallenge,listUserSubmissions} from "../services/store.js";
import {levelFromXp,xpIntoLevel,publicUser} from "../utils/auth.js";

const achievementDefs=[
  {id:"first-blood",icon:"⚔️",name:"First Blood",desc:"Solve your first quest.",target:1},
  {id:"three-quests",icon:"🔥",name:"Triple Threat",desc:"Solve 3 quests.",target:3},
  {id:"five-quests",icon:"🏆",name:"Quest Veteran",desc:"Solve 5 quests.",target:5},
  {id:"streak-7",icon:"📅",name:"On Fire",desc:"Maintain a 7 day streak.",target:7}
];

function todayKey(){return new Date().toISOString().slice(0,10);}

export async function dashboard(req,res){
  const user=publicUser(req.user);
  const level=levelFromXp(req.user.xp),into=xpIntoLevel(req.user.xp);
  const submissions=await listUserSubmissions(req.user._id);
  const dailyPool=await findChallenge("two-sum") || await findChallenge("find-maximum");
  const solved=new Set(req.user.solvedChallenges||[]);
  const achievements=achievementDefs.map(a=>{
    let progress=0;
    if(a.id==="first-blood"||a.id==="three-quests"||a.id==="five-quests")progress=solved.size;
    if(a.id==="streak-7")progress=req.user.streak;
    return {...a,unlocked:(req.user.achievements||[]).includes(a.id),progress:Math.min(progress,a.target)};
  });
  res.json({
    user,level,xpInLevel:into,xpToNext:250-into,
    stats:{solved:solved.size,submissions:submissions.length,achievements:achievements.filter(a=>a.unlocked).length},
    achievements,recentSubmissions:submissions.slice(0,6).map(s=>({
      id:String(s._id),challengeId:s.challengeId,status:s.status,passed:s.passed,total:s.total,
      executionTime:s.executionTime,createdAt:s.createdAt
    })),
    dailyChallenge:dailyPool?{id:dailyPool.slug,title:dailyPool.title,difficulty:dailyPool.difficulty,xp:dailyPool.xp,description:dailyPool.description}:null,
    today:todayKey()
  });
}

export async function profile(req,res){
  const submissions=await listUserSubmissions(req.user._id);
  res.json({user:publicUser(req.user),level:levelFromXp(req.user.xp),recentSubmissions:submissions});
}
