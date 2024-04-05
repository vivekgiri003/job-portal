import jobModel from "../model/jobModel.js";
import mongoose from "mongoose";
import moment from "moment";
//create job
export const createJobController = async (req, res, next) => {
    const { company, position, requiredSkill, eligibility } = req.body;
    if (!company || !position || !requiredSkill || !eligibility) {
        next('Required fields are not filled')
    }
    req.body.createdBy = req.user.userId
    const job = await jobModel.create(req.body);
    res.status(201).json(job);
};

//get job
export const getAllJobController = async (req, res, next) => {
    const {status,workType,position,sort,requiredSkill}  =  req.query;
    const queryObject = {
        createdBy : req.user.userId
    }
    
    //filters
    if(status && status !== 'all'){
        queryObject.status = status;
    }

    if(workType && workType !== 'all'){
        queryObject.workType = workType;
    }
    if(position){
        queryObject.position = {$regex: position , $options:"i"};
    }
    if(requiredSkill){
        queryObject.requiredSkill = {$regex: requiredSkill , $options: "i"};
    }
    let queryResult = jobModel.find(queryObject)

    if(sort === "new"){
        queryResult = queryResult.sort('-createdAt')
    }
    if(sort === "old"){
        queryResult = queryResult.sort('createdAt')
    }
    if(sort === "a-z"){
        queryResult = queryResult.sort('position')
    }
    if(sort === "z-a"){
        queryResult = queryResult.sort('-position')
    }

    //page creation  

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    queryResult = queryResult.skip(skip).limit(limit)
    const totalJobs = await jobModel.countDocuments(queryResult);

    const numOfPage = Math.floor(totalJobs / limit)
    const jobs = await queryResult;




    res.status(200).json({
        totalJobs,
        jobs,
        numOfPage
    })
};

//update jobs

export const updateJobController = async (req, res, next) => {
    const { id } = req.params;
    const { company, position, description, requiredSkill, eligibility, status, workType, workLocation, } = req.body;
    if (!company || !position || !requiredSkill || !eligibility) {
        next('Required fields are not filled');
    }
    const job = await jobModel.findOne({ _id: id })
    if (!job) {
        next(`No job found`);
    }
    if (req.user.userId !== job.createdBy.toString()) {
        next("You are not permitted to update this job")
        return
    }
    const updateJob = await jobModel.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true })
    res.status(200).json({ updateJob });
};

//delete jobs
export const deleteJobController = async (req, res, next) => {
    const { id } = req.params;
    const job = await jobModel.findOne({ _id: id })
    if (!job) {
        next(`No job found`);
    }
    if (req.user.userId !== job.createdBy.toString()) {

        next("You are not permitted to delete this job")
        return
    }
    await job.deleteOne();
    res.status(200).json({ message: 'job deleted' });
};

//jobs stats filter

export const jobStatsController = async (req, res) => {
    const stats = await jobModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId)
            }

        },
        {
            $group: {
                _id: { status: '$status'},
                count: { $sum: 1 }
            }
        }
    ])

    const dStats = stats.map(item =>{
        const {_id:{status},count} = item;
        return {status,count}
    })

    // const defaultStats = {
    //     pending: interviewCount || 0,
    //     reject: pendingCount || 0,
    //     interview: rejectCount || 0
    // }

    let monthlyApplication = await jobModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId)
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        }
    ])
    monthlyApplication = monthlyApplication.map(item => {
        const { _id: { year, month }, count } = item
        const date = moment().month(month - 1).year(year).format('MMM y')
        return { date, count };
    })
        .reverse();
    res.status(200).json({ totalJob: stats.length, dStats, monthlyApplication });
};
