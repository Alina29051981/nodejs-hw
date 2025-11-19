import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { errors as celebrateErrors } from 'celebrate';
import { logger } from './middleware/logger.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import notesRoutes from './routes/notesRoutes.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);

app.use(cors());

app.use(express.json());

app.use(notesRoutes);

app.use(notFoundHandler);

app.use(celebrateErrors());

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
