import { Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

const logSchema = z.object({
  date: z.string(), // ISO date
  type: z.string().min(1),
  notes: z.string().optional(),
  clientId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
});

export const getLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await prisma.interactionLog.findMany({
      where: {
        OR: [
          { client: { userId: req.userId } },
          { project: { client: { userId: req.userId } } },
        ],
      },
      include: {
        client: { select: { name: true } }
      }
    });
    res.json(
      logs.map(log => ({
        ...log,
        clientName: log.client ? log.client.name : '',
      }))
    );
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

export const getLogById = async (req: AuthRequest, res: Response) => {
  try {
    const log = await prisma.interactionLog.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { client: { userId: req.userId } },
          { project: { client: { userId: req.userId } } },
        ],
      },
    });
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json(log);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve log' });
  }
};

export const createLog = async (req: AuthRequest, res: Response) => {
  try {
    const data = logSchema.parse(req.body);
    const log = await prisma.interactionLog.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
    });
    res.status(201).json(log);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateLog = async (req: AuthRequest, res: Response) => {
  try {
    const data = logSchema.partial().parse(req.body);
    const result = await prisma.interactionLog.updateMany({
      where: {
        id: req.params.id,
        OR: [
          { client: { userId: req.userId } },
          { project: { client: { userId: req.userId } } },
        ],
      },
      data: {
        ...data,
        ...(data.date && { date: new Date(data.date) }),
      },
    });
    if (result.count === 0) return res.status(404).json({ error: 'Log not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteLog = async (req: AuthRequest, res: Response) => {
  try {
    const result = await prisma.interactionLog.deleteMany({
      where: {
        id: req.params.id,
        OR: [
          { client: { userId: req.userId } },
          { project: { client: { userId: req.userId } } },
        ],
      },
    });
    if (result.count === 0) return res.status(404).json({ error: 'Log not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
