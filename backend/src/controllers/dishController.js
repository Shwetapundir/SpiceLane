const prisma = require('../config/database');

const getAllDishes = async (req, res, next) => {
  try {
    const { category, isVeg, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      isAvailable: true,
      ...(category && { category }),
      ...(isVeg !== undefined && { isVeg: isVeg === 'true' }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [dishes, total] = await Promise.all([
      prisma.dish.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { rating: 'desc' },
      }),
      prisma.dish.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        dishes,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDishById = async (req, res, next) => {
  try {
    const dish = await prisma.dish.findUnique({ where: { id: req.params.id } });
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found.' });
    }
    res.json({ success: true, data: { dish } });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.dish.findMany({
      where: { isAvailable: true },
      select: { category: true },
      distinct: ['category'],
    });
    res.json({ success: true, data: { categories: categories.map((c) => c.category) } });
  } catch (error) {
    next(error);
  }
};

const createDish = async (req, res, next) => {
  try {
    const dish = await prisma.dish.create({ data: req.body });
    res.status(201).json({ success: true, message: 'Dish created successfully!', data: { dish } });
  } catch (error) {
    next(error);
  }
};

const updateDish = async (req, res, next) => {
  try {
    const dish = await prisma.dish.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, message: 'Dish updated successfully!', data: { dish } });
  } catch (error) {
    next(error);
  }
};

const deleteDish = async (req, res, next) => {
  try {
    await prisma.dish.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Dish deleted successfully!' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllDishes, getDishById, getCategories, createDish, updateDish, deleteDish };
