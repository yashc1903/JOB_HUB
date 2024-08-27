import express from "express"
import cors from 'cors'
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import connectDB from "./utils/db.js";
import userRoutes from './routes/userRoutes.js'

dotenv.config({})
connectDB()


// rest object
const app = express();

//middlewares

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//enable CORS
app.use(cors());

//routes
app.use('/api/v2/user',userRoutes)

//port
const PORT =  process.env.PORT || 8080;

// run listen
app.listen(PORT , ()=>{
    console.log(`server running at PORT ${PORT}`)
})
