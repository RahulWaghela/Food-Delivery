import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import bodyParser from 'body-parser';

import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';

const app = express();
const port = process.env.PORT || 8080;
import dotenv from 'dotenv';
dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/food', foodRouter);
app.use('/api/user',userRouter);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter)

app.use('/uploads', express.static('uploads'));




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
