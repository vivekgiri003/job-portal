import mongoose from "mongoose";

const connectdb = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.Mongo_url)
    }
    catch(e){
        console.log(`database error : ${e}`)
    }
}

export default connectdb;