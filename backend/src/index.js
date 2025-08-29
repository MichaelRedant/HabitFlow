import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './db.js';
import noteRoutes from './routes/notes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/notes', noteRoutes);

const port = process.env.PORT || 4000;

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
