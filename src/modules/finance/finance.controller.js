import prisma from "../../config/prisma.js";

export const createRecord = async (req, res) => {
  try {
    const { amount, type, category, note, date } = req.body;

    const record = await prisma.record.create({
      data: {
        amount: parseFloat(amount),
        type,
        category,
        note,
        date: new Date(date),
        userId: req.user.id
      }
    });

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    const filters = {
      userId: req.user.id,
      isDeleted: false // Soft Delete feature
    };

    if (type) filters.type = type;
    if (category) filters.category = category;

    if (startDate && endDate) {
      filters.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    } else if (startDate) {
      filters.date = {
        gte: new Date(startDate)
      };
    } else if (endDate) {
      filters.date = {
        lte: new Date(endDate)
      };
    }

    const total = await prisma.record.count({ where: filters });
    
    // pagination 
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));

    const records = await prisma.record.findMany({
      where: filters,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: { date: "desc" }
    });

    res.json({
      total,
      page: pageNum,
      limit: limitNum,
      data: records
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.record.update({
      where: { 
        id,
        userId: req.user.id // security
      },
      data: req.body
    });

    res.json(updated);
  } catch (err) {
    if (err.code === 'P2025') {
       return res.status(404).json({ message: "Record not found or unauthorized" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete
    await prisma.record.update({
      where: { 
        id,
        userId: req.user.id 
      },
      data: {
        isDeleted: true
      }
    });

    res.json({ message: "Record deleted" });
  } catch (err) {
    if (err.code === 'P2025') {
       return res.status(404).json({ message: "Record not found or unauthorized" });
    }
    res.status(500).json({ message: err.message });
  }
};
