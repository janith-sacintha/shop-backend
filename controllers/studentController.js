import Student from "../models/student.js"

/*
export function getStudents(req ,res) {
  
    Student.find().then(

        (students)=> {
          res.json(students)
        }

    ).catch(
        ()=> {
          res.json(
            {
              message : "Failed to fetch students"
            }
          )
        }
    )

}
*/

export async function getStudents(req,res){
  try{
    const students = await Student.find()
    res.json(students)

  }catch(error){
    res.status(500).json(
      {
        message : "Fialed to fetch students"
      }
    )
  }
}



export function createStudents(req , res) {

    if(req.user == null){
      res.status(403).json(
        {
          message : "Please login to create a student"
        }
      )
      return
    }

    if(req.user.role != "admin"){
      res.status(403).json(
        {
          message : "Please login as an admin to create a student"
        }
      )
      return
    }

    const student = new Student(
      {
        name : req.body.name ,
        age : req.body.age ,
        email : req.body.email
      }
    )

    student.save().then( () => {
      res.json(
        {
          message : "student saved succesfully"
        }
      )
    }
    ).catch(() => {
      res.json(
        {
          message : "Failed to save student"
        }
      )
    }) 

}