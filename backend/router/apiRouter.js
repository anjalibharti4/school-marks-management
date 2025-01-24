import express, { json } from 'express'
import fs from 'fs'
import { get } from 'http'

const router = express.Router()

router.get('/',(req,resp)=>{
   return resp.json({'msg':'api router root request'})
})
router.get('/read',async(req,resp)=>{
    let stuents = await getStudent()
    console.log(typeof stuents)
    return resp.json(stuents)
})
/*
Usage: create new student
API URL: http://127.0.0.1:8000/api/create
Method Type:POst
Required Fields: roll_no,name,english,hindi,math
Access Type:Public
*/
 router.post('/create',async(req,resp)=>{
    //Fetch the student data from the request body
    let new_student = req.body
    console.log("received student data", new_student)
    console.log("type of new student",typeof new_student)

    //check if required fields are present
    if(!new_student.roll_no || !new_student.name || !new_student.english || !new_student.hindi || !new_student.math){
        return resp.json({msg:"All feild are required"})
    }
    let students = await getStudent()
    let existingStudent = students.find((student)=>{return student.roll_no === new_student.roll_no})
    console.log(existingStudent)
    console.log(typeof existingStudent)
    if(existingStudent){
        console.log("existing student" , existingStudent)
        console.log(typeof existingStudent)
        return resp.json({"msg":"Student already exits"})
    }
    
    students.push(new_student)
    create_student(students)
    return resp.json({'msg':'data created'})      

})
 

router.put('/update/:roll_no',async(req,resp)=>{

    let update_student = req.body;
    console.log('update student details: ',update_student)
    let stu_roll_no = req.params.roll_no;
    console.log("requested roll_no is... ",stu_roll_no)
    
    //check student exist or no
    let students = await getStudent()
    console.log('students are..',students)
    let valid_roll_no = students.find((student)=>{
        return student.roll_no == stu_roll_no
    })
    if(!valid_roll_no){
        return resp.json({msg:"Student not available"})
    }
    
    let remaining_student = students.filter((student)=>{
        return student.roll_no != stu_roll_no
    })

    remaining_student.unshift(update_student)
    create_student(remaining_student)
    return resp.json({msg:"Student updated with new data"})

})

router.delete('/delete/:roll_no',async(req,resp)=>{
    let deleted_roll_no = req.params.roll_no
    console.log(deleted_roll_no)

    let students = await getStudent()

    //check student exist or not
    let delete_student = students.find((student)=>{
        return student.roll_no == deleted_roll_no


    })
    if(!delete_student){
        return resp.json({msg:"Student is not available with given specific roll number.."})
    }

    let remaining_student = students.filter((student)=>{
        return student.roll_no != deleted_roll_no
    })
    create_student(remaining_student)
    return resp.json({msg:"roll number ",deleted_roll_no:deleted_roll_no})
})
      

let getStudent= ()=>{
    let student_data = fs.readFileSync("student.json","utf-8")
    console.log("getStudent")
    console.log(typeof student_data)//string
    return JSON.parse(student_data)// change string to object
}

let create_student = (students)=>{
    console.log("creat_student called")
    
    fs.writeFileSync("student.json",JSON.stringify(students))
}

export default router;
