import connectToMongo from "./db.js";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRouter from './routes/users.js';
import flatOwnerRouter from './routes/flatowners.js';
import paymentRouter from './routes/payment.js';
dotenv.config()
connectToMongo();
const app = express()
const port = process.env.PORT
const BASE_URL = process.env.BASE_URL;
app.use(cors())
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/admin', userRouter);
app.use('/api/user',flatOwnerRouter);
app.use('/api/payment',paymentRouter);
app.listen(port, () => {
    console.log(`Registration Form backend listening on ${BASE_URL}`)
  })