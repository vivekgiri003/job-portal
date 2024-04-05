import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required:[true, 'First name is required']
    },
    lastName:{
        type: String,
        required:[true, "Last name is required"]
    },
    email:{
        type: String,
        reequired:[true, "Email is required"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email"]
    },
    password:{
        type:String,
        required:[true, 'Password is required'],
        minlength:[8, 'Password length should be greater than 8 character'],
        select:true
    },
    cpassword:{
        type:String,
        required:[true,'Confirm password is required'],
        minlength:8,
        select:true
        
    },
    location:{
        type:String,
        default:"India"
    }
},
    {timestamps:true});


// password encryption
userSchema.pre('save',async function(){
    if(!this.isModified) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    this.cpassword = await bcrypt.hash(this.cpassword,salt);
})

//comparepassword
userSchema.methods.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword, this.password)
    return isMatch;
}



// webtoken 
userSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id},process.env.jwt_secret,{expiresIn:'2d'});
}
export default mongoose.model("User",userSchema);