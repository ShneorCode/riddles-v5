import express from 'express';
import { getPlayersController, upsertPlayerController } from '../controllers/playersController.js';
import { authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPlayersController);

router.post('/', authorizeRoles(['user', 'admin']), upsertPlayerController);

export default router;