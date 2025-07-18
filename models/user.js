import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
      firstName : {
        type : String ,
        required : true
      } ,

      lastName : {
        type : String ,
        required : true
     } ,

      email : {
        type : String ,
        required : true ,
        unique : true
      } ,

      password : {
        type : String ,
        required : true
      } ,

      phone : {
        type : String ,
        default : "Not Given"
      } ,

      isBlocked : {
        type : Boolean ,
        default : false
      } ,

      role : {
        type : String ,
        default : "user"
      } ,

      isEmailVerified : {
        type : Boolean ,
        default : false   
      } ,

      image : {
        type : String ,
        default : "https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png"
      }
      
    }
  )
  
  const User = mongoose.model("users" , userSchema)

  export default User;