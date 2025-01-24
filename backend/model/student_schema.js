import mongoose from 'mongoose'
let student_schema = mongoose.Schema({
    roll_no:{type:Number,require:true},
    name:{type:String,require:true},
    english:{type:Number,reqire:true},
    hindi:{type:Number,reqire:true},
    math:{type:Number,reqire:true}
})
let schema_model = mongoose.model("student_mark", student_schema)
export default schema_model