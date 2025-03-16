import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './api';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(apiRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 