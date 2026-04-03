import prisma from "../../config/prisma.js";

export const getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const income = await prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: "INCOME", userId, isDeleted: false }
    });

    const expense = await prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: "EXPENSE", userId, isDeleted: false }
    });

    const totalIncome = income._sum.amount || 0;
    const totalExpense = expense._sum.amount || 0;

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense
      }
    });
  } catch (err) {
    next(err);
  }
};

export const categoryBreakdown = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const data = await prisma.record.groupBy({
      by: ["category"],
      where: { userId, isDeleted: false },
      _sum: { amount: true }
    });

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

export const monthlyTrends = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const records = await prisma.record.findMany({
      where: { userId, isDeleted: false },
      orderBy: { date: "asc" }
    });

    const trends = {};

    records.forEach((r) => {
      const month = r.date.toISOString().slice(0, 7);

      if (!trends[month]) {
        trends[month] = { income: 0, expense: 0 };
      }

      if (r.type === "INCOME") trends[month].income += r.amount;
      else trends[month].expense += r.amount;
    });

    res.json({
      success: true,
      data: trends
    });
  } catch (err) {
    next(err);
  }
};
