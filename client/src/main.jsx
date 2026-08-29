import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import {api} from "./lib/api.js";
import Auth from "./components/Auth.jsx";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import World from "./pages/World.jsx";
import Topic from "./pages/Topic.jsx";
import Challenge from "./pages/Challenge.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Profile from "./pages/Profile.jsx";
import "./styles.css";

function App(){
 const [user,setUser]=useState(null),[screen,setScreen]=useState("dashboard"),[topic,setTopic]=useState(null),[challenge,setChallenge]=useState(null);
 useEffect(()=>{if(localStorage.getItem("dsaquest_token"))api("/auth/me").then(d=>setUser(d.user)).catch(()=>localStorage.removeItem("dsaquest_token"))},[]);
 if(!user)return <Auth onAuth={setUser}/>;
 const goTopic=t=>{setTopic(t);setScreen("topic")},goChallenge=id=>{setChallenge(id);setScreen("challenge")};
 return <Layout user={user} onHome={()=>setScreen("dashboard")} onLeaderboard={()=>setScreen("leaderboard")} onProfile={()=>setScreen("profile")} onLogout={()=>{localStorage.removeItem("dsaquest_token");setUser(null);setScreen("dashboard")}}>
 {screen==="dashboard"&&<Dashboard user={user} onChallenge={goChallenge} onTopic={goTopic}/>}
 {screen==="world"&&<World user={user} onTopic={goTopic} onLeaderboard={()=>setScreen("leaderboard")}/>}
 {screen==="topic"&&<Topic topic={topic} user={user} onBack={()=>setScreen("dashboard")} onChallenge={goChallenge}/>}
 {screen==="challenge"&&<Challenge id={challenge} onBack={()=>setScreen("topic")} onUser={setUser}/>}
 {screen==="leaderboard"&&<Leaderboard onBack={()=>setScreen("dashboard")}/>}
 {screen==="profile"&&<Profile onBack={()=>setScreen("dashboard")}/>}
 </Layout>
}
createRoot(document.getElementById("root")).render(<App/>);
