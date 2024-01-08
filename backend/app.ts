import cors from 'cors'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';

// import indexRouter from './routes/indexRoutes'
// import userRouter from './routes/userRoutes'
// import formRouter from './routes/formRoutes'
// import responsesRouter from './routes/resRoutes'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cookieParser())
app.use(express.json({limit:'20kb'})) // limit the size of incoming request body and parse i.e convert string json to js object for every incoming request
app.use(express.urlencoded({extended:false, limit:'1kb'}));   
app.use(cors({
  origin: [ "http://localhost:5173", "http://localhost:4173/", `${process.env.CLIENT_URL}` ],
  credentials:true ,
  optionsSuccessStatus:200
}));

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(()=>{console.log("Connected to database")})
  .catch((err)=>{console.error("Unable to connect database",err)})

// app.use('/',indexRouter)
// app.use('/u',userRouter)
// app.use('/f',formRouter)
// app.use('/res',responsesRouter)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});