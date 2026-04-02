import prisma from '../config/database';
import { Task, Status } from '@prisma/client';

export interface CreateTaskData {
  title: string;
  description?: string;
  userId: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: Status;
}

export const getTasks = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  status?: Status,
  search?: string
) => {
  const skip = (page - 1) * limit;
  const where: any = { userId };

  if (status) {
    where.status = status;
  }

  if (search) {
    where.title = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const tasks = await prisma.task.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.task.count({ where });

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getTaskById = async (id: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!task) {
    throw new Error('Task not found');
  }

  return task;
};

export const createTask = async (data: CreateTaskData) => {
  return await prisma.task.create({
    data,
  });
};

export const updateTask = async (id: string, userId: string, data: UpdateTaskData) => {
  const task = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!task) {
    throw new Error('Task not found');
  }

  return await prisma.task.update({
    where: { id },
    data,
  });
};

export const deleteTask = async (id: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!task) {
    throw new Error('Task not found');
  }

  await prisma.task.delete({
    where: { id },
  });
};

export const toggleTaskStatus = async (id: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: { id, userId },
  });

  if (!task) {
    throw new Error('Task not found');
  }

  const newStatus = task.status === Status.PENDING ? Status.COMPLETED : Status.PENDING;

  return await prisma.task.update({
    where: { id },
    data: { status: newStatus },
  });
};