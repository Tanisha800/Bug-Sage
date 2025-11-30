import express from "express";
import prisma from "../prismaClient.js";
import pkg from "@prisma/client";
const { BugStatus, PrismaClient } = pkg;

const router = express.Router();
/**
 * POST /bugs
 * Naya bug add karega (default status: BACKLOG)
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const bug = await prisma.bug.create({
      data: {
        title,
        description,
        status: status || BugStatus.BACKLOG,
      },
    });

    res.status(201).json(bug);
  } catch (err) {
    console.error('Error creating bug:', err);
    res.status(500).json({ message: 'Failed to create bug' });
  }
});

/**
 * GET /bugs
 * Saare bugs (optional ?status=IN_PROGRESS / RESOLVED / BACKLOG / TESTING)
 */
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) where.status = status;

    const bugs = await prisma.bug.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(bugs);
  } catch (err) {
    console.error('Error fetching bugs:', err);
    res.status(500).json({ message: 'Failed to fetch bugs' });
  }
});

/**
 * PATCH /bugs/:id/status
 * Bug ka status update karega
 * body: { status: "RESOLVED" | "BACKLOG" | "IN_PROGRESS" | "TESTING" }
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(BugStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await prisma.bug.update({
      where: { id },
      data: { status },
    });

    res.json(updated);
  } catch (err) {
    console.error('Error updating status:', err);

    // Prisma not-found error
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Bug not found' });
    }

    res.status(500).json({ message: 'Failed to update bug status' });
  }
});
router.delete("/:id/status",async(req,res)=>{
    const { id } = req.params.id;

    try{
        await prisma.bug.delete({where:id})
        return res.status(200).json({ message: 'Deleted Succesfully' })
    }
    catch(err){
        console.error('Error deleting bug:', err);
    }
})

/**
 * GET /bugs/stats/summary
 * Dashboard cards ke liye simple counts
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const [backlog, inProgress, testing, resolved] = await Promise.all([
      prisma.bug.count({ where: { status: BugStatus.BACKLOG } }),
      prisma.bug.count({ where: { status: BugStatus.IN_PROGRESS } }),
      prisma.bug.count({ where: { status: BugStatus.TESTING } }),
      prisma.bug.count({ where: { status: BugStatus.RESOLVED } }),
    ]);

    res.json({
      backlog,
      inProgress,
      testing,
      resolved,
    });
  } catch (err) {
    console.error('Error getting stats:', err);
    res.status(500).json({ message: 'Failed to get stats' });
  }
});

export default router;
