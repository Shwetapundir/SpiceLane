const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const dishes = [
  {
    name: 'Paneer Butter Masala',
    description: 'Creamy tomato-based curry with soft paneer cubes, flavored with aromatic spices and fresh cream.',
    price: 280,
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop',
    category: 'Main Course',
    rating: 4.8,
    deliveryTime: 30,
    isVeg: true,
  },
  {
    name: 'Veg Biryani',
    description: 'Fragrant basmati rice cooked with seasonal vegetables, saffron, and whole spices. Served with raita.',
    price: 220,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop',
    category: 'Rice',
    rating: 4.5,
    deliveryTime: 35,
    isVeg: true,
  },
  {
    name: 'Masala Dosa',
    description: 'Crispy golden dosa filled with spiced potato masala. Served with coconut chutney and sambar.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop',
    category: 'South Indian',
    rating: 4.6,
    deliveryTime: 20,
    isVeg: true,
  },
  {
    name: 'Chole Bhature',
    description: 'Spicy chickpea curry paired with fluffy deep-fried bread. A classic Punjabi street food combo.',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop',
    category: 'North Indian',
    rating: 4.7,
    deliveryTime: 25,
    isVeg: true,
  },
  {
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils simmered overnight with butter, cream, and aromatic spices.',
    price: 240,
    imageUrl: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&auto=format&fit=crop',
    category: 'Main Course',
    rating: 4.9,
    deliveryTime: 30,
    isVeg: true,
  },
  {
    name: 'Chicken Tikka Masala',
    description: 'Tender chicken marinated in yogurt and spices, grilled and served in rich tomato-cream sauce.',
    price: 320,
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop',
    category: 'Main Course',
    rating: 4.8,
    deliveryTime: 35,
    isVeg: false,
  },
  {
    name: 'Palak Paneer',
    description: 'Fresh spinach puree cooked with cottage cheese, garlic, and mild spices. Healthy and delicious.',
    price: 260,
    imageUrl: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&auto=format&fit=crop',
    category: 'Main Course',
    rating: 4.5,
    deliveryTime: 25,
    isVeg: true,
  },
  {
    name: 'Pav Bhaji',
    description: 'Mixed vegetable mash cooked in a tangy tomato base, served with buttered pav buns.',
    price: 140,
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop',
    category: 'Street Food',
    rating: 4.6,
    deliveryTime: 20,
    isVeg: true,
  },
  {
    name: 'Butter Naan',
    description: 'Soft leavened bread baked in a tandoor, brushed generously with butter and garlic.',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1614777986387-d1b7e3513c27?w=600&auto=format&fit=crop',
    category: 'Breads',
    rating: 4.4,
    deliveryTime: 15,
    isVeg: true,
  },
  {
    name: 'Gulab Jamun',
    description: 'Soft milk-solid dumplings soaked in rose-flavored sugar syrup. The perfect Indian dessert.',
    price: 100,
    imageUrl: 'https://images.unsplash.com/photo-1601303516534-bf5f3c96e58f?w=600&auto=format&fit=crop',
    category: 'Desserts',
    rating: 4.7,
    deliveryTime: 15,
    isVeg: true,
  },
  {
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice layered with tender chicken, caramelized onions, and saffron. Dum-cooked.',
    price: 320,
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop',
    category: 'Rice',
    rating: 4.9,
    deliveryTime: 40,
    isVeg: false,
  },
  {
    name: 'Aloo Tikki Chaat',
    description: 'Crispy potato patties topped with tangy chutneys, yogurt, chaat masala, and pomegranate seeds.',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=600&auto=format&fit=crop',
    category: 'Street Food',
    rating: 4.5,
    deliveryTime: 20,
    isVeg: true,
  },
  {
    name: 'Mango Lassi',
    description: 'Thick, creamy yogurt-based drink blended with fresh Alphonso mangoes and a hint of cardamom.',
    price: 90,
    imageUrl: 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?w=600&auto=format&fit=crop',
    category: 'Beverages',
    rating: 4.8,
    deliveryTime: 10,
    isVeg: true,
  },
  {
    name: 'Tandoori Chicken',
    description: 'Half chicken marinated in yogurt and spice blend, roasted in a traditional clay tandoor oven.',
    price: 380,
    imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop',
    category: 'Starters',
    rating: 4.7,
    deliveryTime: 30,
    isVeg: false,
  },
  {
    name: 'Samosa',
    description: 'Golden, flaky pastry filled with spiced potatoes and peas. Served with mint and tamarind chutney.',
    price: 50,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop',
    category: 'Starters',
    rating: 4.6,
    deliveryTime: 15,
    isVeg: true,
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@foodapp.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@foodapp.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@foodapp.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@foodapp.com',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log('✅ Test user created:', user.email);

  // Create dishes
  for (const dish of dishes) {
    await prisma.dish.upsert({
      where: { id: dish.name.toLowerCase().replace(/\s+/g, '-') },
      update: dish,
      create: { id: dish.name.toLowerCase().replace(/\s+/g, '-'), ...dish },
    });
  }
  console.log(`✅ ${dishes.length} dishes seeded`);

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
