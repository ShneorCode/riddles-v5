import express from 'express';
import riddlesRoutes from './routes/riddlesRoutes.js';
import playersRoutes from './routes/playersRoutes.js';
import { config } from 'dotenv';
config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

app.use('/api/riddles', riddlesRoutes);
app.use('/api/players', playersRoutes);

app.get('/', (req, res) => {
  res.send('Riddle Game API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
