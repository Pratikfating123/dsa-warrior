import React from "react";
import {Coins,Flame,Home,Trophy,UserRound,LogOut} from "lucide-react";
export default function Layout({user,onHome,onLeaderboard,onProfile,onLogout,children}){
 const level=Math.floor((user?.xp||0)/250)+1;
 return <div className="app"><header className="topbar"><button className="brand" onClick={onHome}><span>⚔️</span><b>DSA <i>QUEST</i></b></button><nav><button onClick={onHome}><Home size={15}/> World</button><button onClick={onLeaderboard}><Trophy size={15}/> Rankings</button><button onClick={onProfile}><UserRound size={15}/> Profile</button></nav><div className="stats"><span>🔥 {user?.streak||0}</span><span>🪙 {user?.coins||0}</span><span>LVL {level}</span><button className="logout" onClick={onLogout}><LogOut size={14}/></button></div></header>{children}</div>
}
