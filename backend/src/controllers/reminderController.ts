import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

const reminderSchema = z.object({
  title: z.string().min(1),
  dueDate: z.string(), // ISO string
  description: z.string().min(1),
  completed: z.boolean().optional(),
  // userId will be set from req.userId, not from the client
});

export async function getReminders(req: AuthRequest, res: Response) {
  try {
    const reminders = await prisma.reminder.findMany({
      where: {
        userId: req.userId!,
      },
    });
    res.json(reminders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getReminderById(req: AuthRequest, res: Response) {
  try {
    const reminder = await prisma.reminder.findFirst({
      where: {
        id: req.params.id,
      },
    });
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json(reminder);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function createReminder(req: AuthRequest, res: Response) {
  try {
    const data = reminderSchema.parse(req.body);
    const reminder = await prisma.reminder.create({
      data: {
        userId: req.userId!,
        title: data.title,
        dueDate: new Date(data.dueDate),
        description: data.description,
        completed: typeof data.completed === 'boolean' ? data.completed : false,

      },
    });
    res.status(201).json(reminder);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateReminder(req: AuthRequest, res: Response) {
  try {
    const data = reminderSchema.partial().parse(req.body);
    const reminder = await prisma.reminder.updateMany({
      where: {
        id: req.params.id,
      },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
        ...(data.description && { description: data.description }),
        ...(typeof data.completed === 'boolean' && { completed: data.completed }),

        userId: req.userId!,
      },
    });
    if (reminder.count === 0) return res.status(404).json({ error: 'Reminder not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteReminder(req: AuthRequest, res: Response) {
  try {
    const reminder = await prisma.reminder.deleteMany({
      where: {
        id: req.params.id,
      },
    });
    if (reminder.count === 0) return res.status(404).json({ error: 'Reminder not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
