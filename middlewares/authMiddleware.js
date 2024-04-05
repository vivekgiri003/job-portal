import jwt from 'jsonwebtoken';

const userAuth= async (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer")){
        next("Authentication Failed");
    }
    const token = authHeader.split(" ")[1];
    try{
        const payload = jwt.verify(token, process.env.jwt_secret)
        req.user = {userId:payload.userId}
        next();
    }catch(e){
        next('Authentication Failed');
    }
}
export default userAuth;