import React,{useEffect,useState} from "react";
import {ArrowLeft,Trophy} from "lucide-react";
import {api} from "../lib/api.js";
export default function Leaderboard({onBack}){const [rows,setRows]=useState([]);useEffect(()=>{api("/leaderboard").then(d=>setRows(d.leaderboard))},[]);return <main className="content"><button className="back" onClick={onBack}><ArrowLeft size={16}/> Back</button><div className="topichead"><div className="trophy"><Trophy/></div><div><span className="eyebrow">RANKINGS</span><h1>Leaderboard</h1><p>Top adventurers by XP.</p></div></div><div className="table">{rows.map(r=><div className="row" key={r.rank}><strong>#{r.rank}</strong><span>{r.name}</span><small>Level {r.level}</small><b>{r.xp} XP</b></div>)}</div></main>}
