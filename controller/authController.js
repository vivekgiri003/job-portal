import userModels from "../model/userModels.js";

export const registerController = async (req, res, next) => {
    // try {
    const { firstName, lastName, email, password, cpassword } = req.body;
    if (!firstName) {
        next('Please enter your First Name');
    }
    if (!lastName) {
        next('Please enter your Last name');
    }
    if (!email) {
        next('Please enter your Email');
    }
    if (!password) {
        next('Please enter your Password');
    }
    if (!cpassword) {
        next('Please enter your Confirm Password');
    }
    if (cpassword !== password) {
        next('Password and Confirm Password are not same');
    }
    const existUser = await userModels.findOne({ email });
    if (existUser) {
        next('Email is already registerd please enter different Email');
    }
    const newUser = await userModels.create({ firstName, lastName, email, password, cpassword });

    const token = newUser.createJWT()
    res.status(201).send({
        success: true,
        message: "User registered successfully",
        newUser:{
            firstName:newUser.firstName,
            lastName:newUser.lastName,
            email:newUser.email,
            location:newUser.location
        },
        token
    });
    // } catch (e) {
    //     next(e);
    // }
};

export const loginController = async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email){
        next("Please enter your email");
    }
    if(!password){
        next("Please enter your password");
    }
    //find user
    const user = await userModels.findOne({email}).select("+cpassword").select("+password")
    if(!user){
        next('Invalid username or password');
    }

    const isMatch = await user.comparePassword(password)
    if(!isMatch){
        next('Invalid username or password');
    }
    user.password = undefined
    user.cpassword = undefined
    const token = user.createJWT()
    res.status(200).json({
        success:true,
        message:"Login Successfully",
        user,
        token,
    })
};