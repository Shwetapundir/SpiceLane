require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const dishes = [
  {
    name: 'Paneer Butter Masala',
    description: 'Tender paneer cubes in a rich, creamy tomato-based gravy with aromatic spices. A North Indian classic.',
    price: 280,
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    category: 'Main Course',
    rating: 4.8,
    deliveryTime: 35,
    isVeg: true,
  },
  {
    name: 'Veg Biryani',
    description: 'Fragrant basmati rice layered with seasonal vegetables, saffron, and fried onions. Served with raita.',
    price: 220,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    category: 'Rice',
    rating: 4.6,
    deliveryTime: 40,
    isVeg: true,
  },
  {
    name: 'Masala Dosa',
    description: 'Crispy golden crepe filled with spiced potato masala, served with coconut chutney and sambar.',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
    category: 'South Indian',
    rating: 4.7,
    deliveryTime: 25,
    isVeg: true,
  },
  {
    name: 'Chole Bhature',
    description: 'Spicy chickpea curry served with fluffy deep-fried bread. A Punjabi breakfast favourite.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80',
    category: 'Breakfast',
    rating: 4.9,
    deliveryTime: 30,
    isVeg: true,
  },
  {
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils in a buttery tomato gravy, simmered overnight for deep, rich flavour.',
    price: 200,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
    category: 'Main Course',
    rating: 4.8,
    deliveryTime: 35,
    isVeg: true,
  },
  {
    name: 'Butter Chicken',
    description: 'Succulent chicken in a velvety tomato-cream sauce infused with fenugreek and garam masala.',
    price: 320,
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80',
    category: 'Main Course',
    rating: 4.9,
    deliveryTime: 40,
    isVeg: false,
  },
  {
    name: 'Palak Paneer',
    description: 'Fresh cottage cheese cubes in a smooth, spiced spinach gravy. Nutritious and delicious.',
    price: 260,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
    category: 'Main Course',
    rating: 4.5,
    deliveryTime: 30,
    isVeg: true,
  },
  {
    name: 'Pav Bhaji',
    description: 'Spiced mashed vegetable curry served with buttered soft dinner rolls. Mumbai street food at its finest.',
    price: 130,
    imageUrl: 'https://images.unsplash.com/photo-1606493894885-a6a07f5d7c42?w=800&q=80',
    category: 'Street Food',
    rating: 4.7,
    deliveryTime: 20,
    isVeg: true,
  },
  {
    name: 'Chicken Biryani',
    description: 'Royal Hyderabadi-style biryani with marinated chicken, aged basmati, and caramelised onions.',
    price: 350,
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80',
    category: 'Rice',
    rating: 4.9,
    deliveryTime: 50,
    isVeg: false,
  },
  {
    name: 'Idli Sambar',
    description: 'Soft steamed rice cakes with pigeon pea lentil soup and coconut chutney. Light and healthy.',
    price: 90,
    imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80',
    category: 'South Indian',
    rating: 4.5,
    deliveryTime: 20,
    isVeg: true,
  },
  {
    name: 'Aloo Paratha',
    description: 'Whole wheat flatbread stuffed with spiced mashed potatoes, served with butter, curd and pickle.',
    price: 100,
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    category: 'Breakfast',
    rating: 4.6,
    deliveryTime: 25,
    isVeg: true,
  },
  {
    name: 'Gulab Jamun',
    description: 'Soft milk-solid dumplings soaked in rose-flavoured sugar syrup. Classic Indian dessert.',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1571511855524-1aeefa2e20c4?w=800&q=80',
    category: 'Desserts',
    rating: 4.8,
    deliveryTime: 15,
    isVeg: true,
  },
  {
    name: 'Tandoori Chicken',
    description: 'Juicy chicken marinated in yoghurt and spices, charred in a traditional clay tandoor oven.',
    price: 380,
    imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80',
    category: 'Starters',
    rating: 4.7,
    deliveryTime: 35,
    isVeg: false,
  },
  {
    name: 'Veg Spring Rolls',
    description: 'Crispy golden rolls filled with seasoned vegetables and glass noodles. Indo-Chinese fusion snack.',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    category: 'Starters',
    rating: 4.4,
    deliveryTime: 20,
    isVeg: true,
  },
  {
    name: 'Rasgulla',
    description: 'Spongy chenna balls cooked in light sugar syrup. A Bengali sweet delight.',
    price: 70,
    imageUrl: 'https://images.unsplash.com/photo-1605197788044-805d13c67b22?w=800&q=80',
    category: 'Desserts',
    rating: 4.5,
    deliveryTime: 10,
    isVeg: true,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@foodapp.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@foodapp.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('user123', 12);
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
      where: { id: dish.name.toLowerCase().replace(/ /g, '-') },
      update: dish,
      create: { id: dish.name.toLowerCase().replace(/ /g, '-'), ...dish },
    });
  }
  console.log(`✅ ${dishes.length} dishes seeded`);

  console.log('\n🎉 Seeding complete!');
  console.log('Admin: admin@foodapp.com / admin123');
  console.log('User:  user@foodapp.com  / user123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
