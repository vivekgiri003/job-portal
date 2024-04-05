import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    company:{
        type:String,
        required:[true,'Company name is require'],
    },
    position:{
        type:String,
        required:[true,'Job Position is required'],
        maxlength:100
    },
    description:{
        type:String
    },
    requiredSkill:{
        type:String,
        required:[true,'Skills are required']
    },
    eligibility:{
        type:String,
        require:[true,'Eligibility is required']
    },
    status:{
        type:String,
        enum: ['pending','reject','interview'],
        default: 'pending'
    },
    workType:{
        type:String,
        enum:['full-time','part-time','internship'],
        default: "full-time"
    },
    workLocation:{
        type: String,
        default:'remote',
        required:[true,'work location is required']
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref: 'User'
    }
},{timestamps:true})

export default mongoose.model('Job', jobSchema)