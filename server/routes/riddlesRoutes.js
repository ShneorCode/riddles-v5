import express from 'express';
import { getRiddlesController, addRiddleController, updateRiddleController, deleteRiddleController } from '../controllers/riddlesController.js';

const router = express.Router();

router.get('/', getRiddlesController);
router.post('/', addRiddleController);
router.put('/:id', updateRiddleController);
router.delete('/:id', deleteRiddleController);

export default router;
