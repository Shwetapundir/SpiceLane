const prisma = require('../config/prisma');

const getAllDishes = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isAvailable: true };
    if (category && category !== 'all') where.category = category;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [dishes, total] = await Promise.all([
      prisma.dish.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'asc' } }),
      prisma.dish.count({ where }),
    ]);

    res.json({ dishes, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
};

const getDishById = async (req, res, next) => {
  try {
    const dish = await prisma.dish.findUnique({ where: { id: req.params.id } });
    if (!dish) return res.status(404).json({ error: 'Dish not found' });
    res.json({ dish });
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.dish.findMany({
      select: { category: true },
      distinct: ['category'],
      where: { isAvailable: true },
    });
    res.json({ categories: categories.map(c => c.category) });
  } catch (err) {
    next(err);
  }
};

// Admin controllers
const createDish = async (req, res, next) => {
  try {
    const dish = await prisma.dish.create({ data: req.body });
    res.status(201).json({ message: 'Dish created', dish });
  } catch (err) {
    next(err);
  }
};

const updateDish = async (req, res, next) => {
  try {
    const dish = await prisma.dish.update({ where: { id: req.params.id }, data: req.body });
    res.json({ message: 'Dish updated', dish });
  } catch (err) {
    next(err);
  }
};

const deleteDish = async (req, res, next) => {
  try {
    await prisma.dish.delete({ where: { id: req.params.id } });
    res.json({ message: 'Dish deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllDishes, getDishById, getCategories, createDish, updateDish, deleteDish };
