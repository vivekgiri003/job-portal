import userModels from "../model/userModels.js";

export const updateUserController = async (req, res, next) => {
    const { firstName, lastName, email, location } = req.body;
    if (!firstName || !lastName || !email) {
        next('Please provide all field')
    }
    const user = await userModels.findOne({ _id: req.user.userId }).select('+password').select('+cpassword')
    console.log(user);
    user.firstName = firstName
    user.lastName = lastName
    user.email = email
    user.location = location

    await user.save()
    const token = user.createJWT()
    user.password = undefined
    user.cpassword = undefined
    res.status(200).json({
        user,
        token
    });
};