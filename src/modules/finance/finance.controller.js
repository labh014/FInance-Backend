import prisma from "../../config/prisma.js";
import { recordSchema } from "../../utils/validation.js";

export const createRecord = async (req, res, next) => {
  try {
    const parsed = recordSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors
      });
    }

    const { amount, type, category, note, date } = parsed.data;

    const record = await prisma.record.create({
      data: {
        amount,
        type,
        category,
        note,
        date: new Date(date),
        userId: req.user.id
      }
    });

    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

export const getRecords = async (req, res, next) => {
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
      filters.date = { gte: new Date(startDate) };
    } else if (endDate) {
      filters.date = { lte: new Date(endDate) };
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
      success: true,
      data: records,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum
      }
    });
  } catch (err) {
    next(err);
  }
};

export const updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (Object.keys(req.body).length > 0) {
        const parsed = recordSchema.partial().safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: parsed.error.errors
            });
        }
    }

    const updated = await prisma.record.update({
      where: { 
        id,
        userId: req.user.id // security
      },
      data: req.body
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    if (err.code === 'P2025') {
       return res.status(404).json({ success: false, message: "Record not found or unauthorized" });
    }
    next(err);
  }
};

export const deleteRecord = async (req, res, next) => {
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

    res.json({ success: true, message: "Record deleted" });
  } catch (err) {
    if (err.code === 'P2025') {
       return res.status(404).json({ success: false, message: "Record not found or unauthorized" });
    }
    next(err);
  }
};
