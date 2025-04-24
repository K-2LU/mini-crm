import { Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [totalClients, totalProjects, upcomingReminders, projectStatusCounts] = await Promise.all([
      prisma.client.count({ where: { userId } }),
      prisma.project.count({ where: { client: { userId } } }),
      prisma.reminder.findMany({
        where: {
          OR: [
            { client: { userId } },
            { project: { client: { userId } } },
          ],
          dueDate: {
            gte: now,
            lte: nextWeek,
          },
        },
      }),
      prisma.project.groupBy({
        by: ['status'],
        _count: { _all: true },
        where: { client: { userId } },
      }),
    ]);

    res.json({
      totalClients,
      totalProjects,
      upcomingReminders,
      projectStatusCounts,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};
