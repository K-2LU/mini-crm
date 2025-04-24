import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

const projectSchema = z.object({
  clientId: z.string().uuid(),
  title: z.string().min(1),
  budget: z.number().nonnegative(),
  deadline: z.string(), // ISO date string
  status: z.string().min(1),
});

export async function getProjects(req: AuthRequest, res: Response) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        client: { userId: req.userId },
      },
    });
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getProjectById(req: AuthRequest, res: Response) {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, client: { userId: req.userId } },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function createProject(req: AuthRequest, res: Response) {
  try {
    const data = projectSchema.parse(req.body);
    const project = await prisma.project.create({
      data: {
        ...data,
        deadline: new Date(data.deadline),
      },
    });
    res.status(201).json(project);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateProject(req: AuthRequest, res: Response) {
  try {
    const data = projectSchema.partial().parse(req.body);
    const project = await prisma.project.updateMany({
      where: { id: req.params.id, client: { userId: req.userId } },
      data: {
        ...data,
        ...(data.deadline && { deadline: new Date(data.deadline) }),
      },
    });
    if (project.count === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteProject(req: AuthRequest, res: Response) {
  try {
    const project = await prisma.project.deleteMany({
      where: { id: req.params.id, client: { userId: req.userId } },
    });
    if (project.count === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
