import React,{useEffect,useState} from "react";
import {ArrowRight,CheckCircle2,Clock3,Flame,Lock,Play,Trophy,Zap,Coins,Target,RefreshCw} from "lucide-react";
import {api} from "../lib/api.js";

const topicMeta={arrays:["🏡","Array Village","green"],recursion:["🏰","Recursion Castle","purple"],trees:["🌲","Tree Forest","amber"],sorting:["⚓","Sorting Harbor","blue"]};

function timeAgo(date){const sec=Math.max(0,Math.floor((Date.now()-new Date(date))/1000));if(sec<60)return "just now";if(sec<3600)return `${Math.floor(sec/60)}m ago`;if(sec<86400)return `${Math.floor(sec/3600)}h ago`;return `${Math.floor(sec/86400)}d ago`;}

export default function Dashboard({user,onChallenge,onTopic}){
 const [data,setData]=useState(null),[topics,setTopics]=useState([]),[loading,setLoading]=useState(true);
 async function load(){setLoading(true);try{const [d,c]=await Promise.all([api("/dashboard"),api("/challenges")]);setData(d);const grouped={};c.challenges.forEach(x=>(grouped[x.topicId]??=[]).push(x));setTopics(Object.keys(topicMeta).map(id=>({id,challenges:grouped[id]||[]})))}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 if(loading||!data)return <main className="dashboard"><div className="loading"><RefreshCw className="spin"/> Loading your quest...</div></main>;
 const pct=Math.round((data.xpInLevel/250)*100),solved=new Set(data.user.solvedChallenges);
 const next=topics.flatMap(x=>x.challenges).find(x=>!solved.has(x.id));
 return <main className="dashboard">
  <section className="dashhero"><div><span className="eyebrow">WELCOME BACK, ADVENTURER</span><h1>Ready for your next <span>quest?</span></h1><p>Keep your streak alive and turn another DSA concept into XP.</p><div className="hero-actions">{next&&<button className="primary" onClick={()=>onChallenge(next.id)}><Play size={16}/> Continue Quest <ArrowRight size={16}/></button>}<button className="secondary" onClick={()=>onTopic("arrays")}>Explore World</button></div></div><div className="hero-orb"><div className="orb">⚔️</div><small>LEVEL {data.level}</small><b>{data.user.xp} XP</b><div className="bar"><i style={{width:`${pct}%`}}/></div><span>{data.xpToNext} XP to next level</span></div></section>

  <section className="statgrid">
   <div className="statcard"><span className="staticon blue"><Zap/></span><div><small>TOTAL XP</small><strong>{data.user.xp}</strong><em>+{data.xpInLevel} this level</em></div></div>
   <div className="statcard"><span className="staticon orange"><Flame/></span><div><small>STREAK</small><strong>{data.user.streak} days</strong><em>Keep it going!</em></div></div>
   <div className="statcard"><span className="staticon gold"><Coins/></span><div><small>COINS</small><strong>{data.user.coins}</strong><em>Spend on hints</em></div></div>
   <div className="statcard"><span className="staticon green"><Target/></span><div><small>QUESTS SOLVED</small><strong>{data.stats.solved}</strong><em>{data.stats.achievements} badges</em></div></div>
  </section>

  <section className="dashgrid">
   <div className="panel daily"><div className="panelhead"><div><span className="eyebrow">DAILY QUEST</span><h2>Today's Challenge</h2></div><span className="pill">+{data.dailyChallenge?.xp||0} XP</span></div>{data.dailyChallenge?<><div className="dailyart">🎯</div><h3>{data.dailyChallenge.title}</h3><p>{data.dailyChallenge.description}</p><div className="dailybottom"><span>{data.dailyChallenge.difficulty}</span><button className="primary small" onClick={()=>onChallenge(data.dailyChallenge.id)}>Start challenge <ArrowRight size={14}/></button></div></>:<p>No daily challenge available.</p>}</div>

   <div className="panel achievements"><div className="panelhead"><div><span className="eyebrow">PROGRESSION</span><h2>Achievements</h2></div><Trophy size={18}/></div><div className="achievementlist">{data.achievements.map(a=><div className={`achievement ${a.unlocked?"unlocked":""}`} key={a.id}><span className="badgeicon">{a.unlocked?a.icon:<Lock size={16}/>}</span><div><b>{a.name}</b><small>{a.desc}</small><div className="mini-bar"><i style={{width:`${Math.round(a.progress/a.target*100)}%`}}/></div></div><em>{a.progress}/{a.target}</em></div>)}</div></div>
  </section>

  <section className="panel mapmini"><div className="panelhead"><div><span className="eyebrow">WORLD MAP</span><h2>Your journey</h2></div><button className="textbtn" onClick={()=>onTopic("arrays")}>View quests <ArrowRight size={14}/></button></div><div className="zonerow">{topics.map(t=>{const m=topicMeta[t.id],done=t.challenges.length&&t.challenges.every(c=>solved.has(c.id));return <button key={t.id} className={`zonecard ${m[2]}`} onClick={()=>onTopic(t.id)}><span>{m[0]}</span><div><b>{m[1]}</b><small>{done?"Completed":`${t.challenges.filter(c=>solved.has(c.id)).length}/${t.challenges.length} solved`}</small></div>{done?<CheckCircle2/>:<ArrowRight/>}</button>})}</div></section>

  <section className="dashgrid lower"><div className="panel activity"><div className="panelhead"><div><span className="eyebrow">ACTIVITY</span><h2>Recent submissions</h2></div><Clock3 size={18}/></div>{data.recentSubmissions.length?<div className="activitylist">{data.recentSubmissions.map(s=><div className="activityrow" key={s.id}><span className={s.status==="Accepted"?"check":"fail"}>{s.status==="Accepted"?<CheckCircle2/>:<Clock3/>}</span><div><b>{s.challengeId}</b><small>{s.passed}/{s.total} tests · {timeAgo(s.createdAt)}</small></div><strong className={s.status==="Accepted"?"success":"danger"}>{s.status}</strong></div>)}</div>:<div className="empty">Your submissions will appear here.</div>}</div><div className="panel tips"><span className="eyebrow">PLAYER TIP</span><h2>Consistency beats intensity.</h2><p>Complete one small quest every day. Your streak is designed to reward the habit, not just the final answer.</p><div className="tipline"><Flame size={16}/> <b>{data.user.streak} day streak</b></div></div></section>
 </main>
}
