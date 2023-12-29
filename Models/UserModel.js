import * as mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    email : {type : String, unique : true},
    password : {
        type : String,
        
    }
})

const User = mongoose.model("User", UserSchema)

export default User