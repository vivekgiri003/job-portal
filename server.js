import express from "express";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import dotenv from "dotenv";
import cors from "cors";
import morgon from "morgan";
import 'express-async-errors';

import helmet from "helmet";
import xsclean from "xss-clean";
import mongoSanitize from "express-mongo-sanitize"
import rateLimit from "express-rate-limit";

import connectdb from "./config/db.js";
//swagger api config
const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Job Portal Web-Application",
            description: " NodeJS EXpressJS Job Portal"
        },
        servers: [
            {
                url: "http://localhost:8000"
            }
        ]
    },
    apis:["./routes/*.js"]
}

const spec = swaggerJSDoc(options)

import testRoutes from "./routes/testRoute.js"
import authRoutes from "./routes/authRoute.js"
import errorMiddleware from "./middlewares/errorMiddleware.js";
import userRoutes from './routes/userRoutes.js'
import jobsRoutes from './routes/jobsRoute.js'
//configuration in env file
dotenv.config();

//database connection
connectdb();

const app = express();

app.use(helmet());
app.use(xsclean());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgon("dev"));

//routes
// app.get('/', (req,res)=>{
//     res.send("<h1>Welcome to Job Portal</h2>");
// })

app.use('/api/v1/test', testRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/job', jobsRoutes)

app.use("/api-doc",swaggerUI.serve, swaggerUI.setup(spec) );

//validate middleware
app.use(errorMiddleware)

const port = process.env.PORT || 8000;

app.listen(port, () => {
})