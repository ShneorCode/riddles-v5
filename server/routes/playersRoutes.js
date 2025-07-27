import express from 'express';
import { getPlayersController, upsertPlayerController } from '../controllers/playersController.js';

const router = express.Router();

router.get('/', getPlayersController);
router.post('/', upsertPlayerController);

export default router;
