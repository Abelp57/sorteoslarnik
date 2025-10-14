/* eslint-disable */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.raffle.deleteMany();
  await prisma.winner.deleteMany();

  await prisma.raffle.createMany({
    data: [
      {
        title: 'iPhone 17 Pro Max (256 GB)',
        category: 'tec',
        price: 149,
        total: 1000,
        sold: 312,
        closeDate: new Date('2025-08-22T20:00:00-06:00'),
        image: '/assets/iphone17.jpg',
        badge: 'Nuevo',
        badgeStyle: 'success'
      },
      {
        title: 'iPhone 16 Pro Max (256 GB)',
        category: 'tec',
        price: 129,
        total: 800,
        sold: 523,
        closeDate: new Date('2025-08-29T20:00:00-06:00'),
        image: '/assets/iphone16.jpg',
        badge: 'En promoción',
        badgeStyle: 'promo'
      },
      {
        title: 'Moto Honda CRF300 Rally',
        category: 'moto',
        price: 199,
        total: 1200,
        sold: 78,
        closeDate: new Date('2025-09-05T20:00:00-06:00'),
        image: '/assets/crf300.jpg',
        badge: 'Recién agregada',
        badgeStyle: 'warn'
      }
    ]
  });

  await prisma.winner.createMany({
    data: [
      { date: new Date('2025-07-28'), prize: 'iPad Pro 11”',       ticket: '0245', name: 'María L.', city: 'Guadalajara' },
      { date: new Date('2025-08-02'), prize: 'Apple Watch Ultra 2', ticket: '0007', name: 'Jorge P.', city: 'CDMX' },
      { date: new Date('2025-08-10'), prize: 'PlayStation 5',       ticket: '1189', name: 'Ana K.',   city: 'Monterrey' }
    ]
  });
}

main().finally(() => prisma.$disconnect());
