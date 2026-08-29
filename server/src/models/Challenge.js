import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  input:String, expectedOutput:String, hidden:{type:Boolean,default:false}
},{_id:false});

const schema = new mongoose.Schema({
  slug:{type:String,unique:true,index:true},
  topicId:{type:String,index:true},
  title:String, description:String,
  difficulty:{type:String,enum:["Easy","Medium","Hard"]},
  xp:Number, language:{type:String,default:"javascript"},
  starterCode:String, examples:[String], hints:[String], keywords:[String],
  testCases:[testSchema], order:Number, createdAt:{type:Date,default:Date.now}
});
export default mongoose.model("Challenge",schema);
