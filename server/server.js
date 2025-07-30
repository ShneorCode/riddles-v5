import express from 'express';
import riddlesRoutes from './routes/riddlesRoutes.js';
import playersRoutes from './routes/playersRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';
import { config } from 'dotenv';
import cors from 'cors';

config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

app.use(authenticateToken);

app.use('/api/riddles', riddlesRoutes);
app.use('/api/players', playersRoutes);

app.get('/', (req, res) => {
  res.send('Riddle Game API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});