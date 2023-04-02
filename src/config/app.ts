import express from 'express';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
//
import globalErrorHandler from '../middlewares/globalErrorHandler';
import routeNotFound from '../middlewares/routeNotFound';
import indexRouter from '../routes/index';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(indexRouter);

app.use(routeNotFound);
app.use(globalErrorHandler);

export { app };
