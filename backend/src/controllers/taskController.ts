import { Request, Response } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from '../services/taskService';
import { Status } from '@prisma/client';
import { validateTaskInput } from '../utils/validators';

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as Status | undefined;
    const search = req.query.search as string | undefined;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: 'Page and limit must be positive numbers' });
    }

    const result = await getTasks(userId, page, limit, status, search);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;

    const task = await getTaskById(id, userId);
    res.json(task);
  } catch (error: any) {
    if (error.message === 'Task not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const createNewTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.user!.userId;

    const errors = validateTaskInput(title, description);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const task = await createTask({ title, description, userId });
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateExistingTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;
    const { title, description, status } = req.body;

    if (title !== undefined || description !== undefined) {
      const errors = validateTaskInput(title, description);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
    }

    const task = await updateTask(id, userId, { title, description, status });
    res.json(task);
  } catch (error: any) {
    if (error.message === 'Task not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

export const deleteExistingTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;

    await deleteTask(id, userId);
    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Task not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const toggleTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;

    const task = await toggleTaskStatus(id, userId);
    res.json(task);
  } catch (error: any) {
    if (error.message === 'Task not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};