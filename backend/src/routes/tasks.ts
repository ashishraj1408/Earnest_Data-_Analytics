import { Router } from 'express';
import {
  getAllTasks,
  getTask,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  toggleTask,
} from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All task routes require authentication
router.use(authenticateToken);

router.get('/', getAllTasks);
router.post('/', createNewTask);
router.get('/:id', getTask);
router.patch('/:id', updateExistingTask);
router.delete('/:id', deleteExistingTask);
router.patch('/:id/toggle', toggleTask);

export default router;