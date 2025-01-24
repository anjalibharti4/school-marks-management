import express from 'express'
import mongoose from 'mongoose'
import schema_model from '../model/student_schema.js'
let router = express.Router()


router.get('/',(req,resp)=>{
    return resp.json({'msg':'this is root router'})
})

router.get("/read",async(req, resp)=>{
    try{
        let students = await schema_model.find();
        return resp.status(200).json(students);
    }
    catch(err){
        return resp.status(500).json({'msg': err.message})
    }
})
router.post("/create",async(req,resp)=>{
    console.log("i am in post method")
    try{
       let new_student = req.body
       console.log("new_student",new_student)
       let existingStudent = await schema_model.findOne({'roll_no':new_student.roll_no});
       console.log(existingStudent)
       if(existingStudent){
        return resp.json({'msg':'student already exits'})
       }
       existingStudent = new schema_model(new_student)
       console.log(existingStudent)
       existingStudent = await existingStudent.save()
       console.log(existingStudent)
       return resp.status(200).json({'msg':'new student created'})

    }
    catch(err){
        return resp.status(500).json({'msg':err.message})
    }
})
router.delete("/delete/:roll_no",async(req,resp)=>{
    console.log("i am delete method")
    try{
        let rollNo = parseInt(req.params.roll_no)
        console.log(typeof rollNo)

       

        //check student exists or not
        let student = await schema_model.findOne({roll_no:rollNo})
        console.log("student found:",student)

        if(!student){
            return resp.json({msg:"student not found"})
        }

    await schema_model.deleteOne({roll_no:rollNo})
    return resp.json({msg:'student deleted'})
    }
    catch(err){
        return resp.json({msg:err.message})
    }

})


/* router.delete("/delete/:roll_no", async (req, resp) => {
    console.log("I am in delete method");
    try {
      const rollNo = parseInt(req.params.roll_no); // Convert roll_no to a number
      console.log("Roll number to delete:", rollNo);
  
      if (isNaN(rollNo)) {
        return resp.status(400).json({ msg: "Invalid roll number provided" });
      }
  
      // Check if the student exists
      let student = await schema_model.findOne({ roll_no: rollNo }); // Correctly passing an object
      console.log("Student found:", student);
  
      if (!student) {
        return resp.status(404).json({ msg: "Student not found" });
      }
  
      // Delete the student
      await schema_model.deleteOne({ roll_no: rollNo });
      console.log("Student deleted successfully");
  
      return resp.status(200).json({ msg: "Student deleted successfully" });
    } catch (err) {
      console.error("Error deleting student:", err.message);
      return resp.status(500).json({ msg: err.message });
    }
  }); */

  router.put('/update/:roll_no',async(req,resp)=>{
    let requested_roll_no = parseInt(req.params.roll_no)
    console.log("roll number to update: ", requested_roll_no)
    let updatedData  = req.body

    //check and update if the student exists
    
    let result = await schema_model.findOneAndUpdate({ roll_no: requested_roll_no },updatedData,
        {new:true}
    );

    if(!result){
        return resp.status(404).json({msg:'student not found'})
    }

    return resp.status(200).json({msg:'student updated', student : result})
  })

router.get('/top_student/:subject', async(req, resp)=>{
    try{
        let subject = req.params.subject

        let top_student = await schema_model.findOne().sort({[subject]: -1}).limit(1)

        if(!top_student){
            return resp.json({msg:'student not found'})
        }
        return resp.status(200).json({msg:'top student', student: top_student

        })
    }
    catch(err){
        console.error('Error finding top student:', err);
        return resp.status(500).json({ msg: 'Something went wrong', error: err.message })
    }
})  
export default router;