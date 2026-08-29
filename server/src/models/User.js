import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name:{type:String,required:true,trim:true,maxlength:40},
  email:{type:String,required:true,unique:true,lowercase:true,index:true},
  passwordHash:{type:String,required:true},
  role:{type:String,enum:["user","admin"],default:"user"},
  xp:{type:Number,default:0},
  coins:{type:Number,default:100},
  streak:{type:Number,default:0},
  lastActiveDate:{type:String,default:""},
  solvedChallenges:[{type:String}],
  achievements:[{type:String}],
  createdAt:{type:Date,default:Date.now}
});
export default mongoose.model("User",schema);
