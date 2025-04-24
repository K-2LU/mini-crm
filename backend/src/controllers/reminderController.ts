import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

const reminderSchema = z.object({
  dueDate: z.string(), // ISO string
  description: z.string().min(1),
  clientId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
});

export async function getReminders(req: AuthRequest, res: Response) {
  try {
    const reminders = await prisma.reminder.findMany({
      where: {
        OR: [
          { client: { userId: req.userId } },
          { project: { client: { userId: req.userId } } },
        ],
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
        OR: [
          { client: { userId: req.userId } },
          { project: { client: { userId: req.userId } } },
        ],
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
        ...data,
        dueDate: new Date(data.dueDate),
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
        OR: [
          { client: { userId: req.userId } },
          { project: { client: { userId: req.userId } } },
        ],
      },
      data: {
        ...data,
        ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
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
        OR: [
          { client: { userId: req.userId } },
          { project: { client: { userId: req.userId } } },
        ],
      },
    });
    if (reminder.count === 0) return res.status(404).json({ error: 'Reminder not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
