import { Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

const clientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  company: z.string().optional(),
  notes: z.string().optional(),
});

export const getClients = async (req: AuthRequest, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      where: { userId: req.userId },
    });
    res.json(clients);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
};

export const getClientById = async (req: AuthRequest, res: Response) => {
  try {
    const client = await prisma.client.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch client' });
  }
};

export const createClient = async (req: AuthRequest, res: Response) => {
  try {
    const data = clientSchema.parse(req.body);
    const newClient = await prisma.client.create({
      data: { ...data, userId: req.userId! },
    });
    res.status(201).json(newClient);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateClient = async (req: AuthRequest, res: Response) => {
  try {
    const data = clientSchema.partial().parse(req.body);
    const result = await prisma.client.updateMany({
      where: { id: req.params.id, userId: req.userId },
      data,
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response) => {
  try {
    const result = await prisma.client.deleteMany({
      where: { id: req.params.id, userId: req.userId },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
