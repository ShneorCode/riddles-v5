import express from 'express';
import { getRiddlesController, addRiddleController, updateRiddleController, deleteRiddleController } from '../controllers/riddlesController.js';
import { authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authorizeRoles(['guest', 'user', 'admin']), getRiddlesController);

router.post('/', authorizeRoles(['user', 'admin']), addRiddleController);

router.put('/:id', authorizeRoles(['admin']), updateRiddleController);

router.delete('/:id', authorizeRoles(['admin']), deleteRiddleController);

export default router;