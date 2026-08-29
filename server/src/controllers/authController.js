import bcrypt from "bcryptjs";
import {z} from "zod";
import {createUser,findUserByEmail} from "../services/store.js";
import {publicUser,signToken} from "../utils/auth.js";

const registerSchema=z.object({name:z.string().min(2).max(40),email:z.string().email(),password:z.string().min(8).max(100)});

export async function register(req,res){
  const d=registerSchema.parse(req.body),email=d.email.toLowerCase();
  if(await findUserByEmail(email))return res.status(409).json({message:"Email already registered"});
  const user=await createUser({name:d.name,email,passwordHash:await bcrypt.hash(d.password,12),role:"user"});
  res.status(201).json({token:signToken(user),user:publicUser(user)});
}
export async function login(req,res){
  const email=String(req.body.email||"").toLowerCase(),password=String(req.body.password||"");
  const user=await findUserByEmail(email);
  if(!user||!(await bcrypt.compare(password,user.passwordHash)))return res.status(401).json({message:"Invalid email or password"});
  res.json({token:signToken(user),user:publicUser(user)});
}
export async function me(req,res){res.json({user:publicUser(req.user)});}
