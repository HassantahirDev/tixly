import { PrismaClient, Role, PaymentStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper function to generate a random float with precision
function randomFloat(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

async function main() {
  console.log('Starting seeding...');

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
    },
  });

  // Create Admin Bank Details
  await prisma.adminBankDetails.create({
    data: {
      adminId: admin.id,
      bankName: 'Admin Bank',
      accountNumber: faker.finance.accountNumber(),
    },
  });

  // Create Event Categories
  const categories = [
    'Music', 'Technology', 'Sports', 'Education', 'Entertainment',
    'Business', 'Food', 'Art', 'Fashion', 'Health'
  ];

  const createdCategories = await Promise.all(
    categories.map(name =>
      prisma.eventCategory.create({
        data: {
          name,
          attachment: faker.image.urlLoremFlickr({ category: name.toLowerCase() }),
        },
      })
    )
  );

  // Create 20 Organizers
  const organizers = await Promise.all(
    Array(20).fill(null).map(async () => {
      const organizerPassword = await bcrypt.hash('password123', 10);
      return prisma.organizer.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: organizerPassword,
          profilePic: faker.image.avatar(),
          isVerified: true,
          verificationCode: '1234',
        },
      });
    })
  );

  // Create Organizer Bank Details
  await Promise.all(
    organizers.map(organizer =>
      prisma.organizerBankDetails.create({
        data: {
          organizerId: organizer.id,
          bankName: faker.company.name(),
          accountNumber: faker.finance.accountNumber(),
        },
      })
    )
  );

  // Create 50 Users
  const users = await Promise.all(
    Array(50).fill(null).map(async () => {
      const userPassword = await bcrypt.hash('password123', 10);
      return prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: userPassword,
          profilePic: faker.image.avatar(),
          isVerified: true,
          verificationCode: '1234',
        },
      });
    })
  );

  // Create 100 Events
  const events = await Promise.all(
    Array(100).fill(null).map(async () => {
      const startDate = faker.date.future();
      const endDate = new Date(startDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
      
      return prisma.event.create({
        data: {
          title: faker.company.catchPhrase(),
          description: faker.lorem.paragraphs(2),
          attachment: faker.image.urlLoremFlickr({ category: 'event' }),
          date: startDate,
          startTime: startDate,
          endTime: endDate,
          capacity: faker.number.int({ min: 50, max: 1000 }),
          location: faker.location.city(),
          price: randomFloat(10, 500),
          ageLimit: faker.number.int({ min: 0, max: 21 }),
          highlights: Array(3).fill(null).map(() => faker.lorem.sentence()),
          organizerId: faker.helpers.arrayElement(organizers).id,
          eventCategoryId: faker.helpers.arrayElement(createdCategories).id,
          approvedByAdmin: true,
        },
      });
    })
  );

  // Create Comments
  const comments = await Promise.all(
    Array(200).fill(null).map(() =>
      prisma.comment.create({
        data: {
          content: faker.lorem.paragraph(),
          userId: faker.helpers.arrayElement(users).id,
          eventId: faker.helpers.arrayElement(events).id,
        },
      })
    )
  );

  // Create Replies
  await Promise.all(
    Array(300).fill(null).map(() =>
      prisma.reply.create({
        data: {
          content: faker.lorem.sentence(),
          userId: faker.helpers.arrayElement(users).id,
          commentId: faker.helpers.arrayElement(comments).id,
        },
      })
    )
  );

  // Create Comment Likes
  await Promise.all(
    Array(400).fill(null).map(async () => {
      try {
        return await prisma.commentLike.create({
          data: {
            userId: faker.helpers.arrayElement(users).id,
            commentId: faker.helpers.arrayElement(comments).id,
          },
        });
      } catch (error) {
        // Ignore unique constraint violations
        if (error.code !== 'P2002') throw error;
      }
    })
  );

  // Create Event Registration Payments
  await Promise.all(
    Array(50).fill(null).map(() =>
      prisma.eventRegistrationPayment.create({
        data: {
          amount: randomFloat(100, 1000),
          screenshotUrl: faker.image.urlLoremFlickr({ category: 'payment' }),
          status: faker.helpers.arrayElement(Object.values(PaymentStatus)),
          organizerId: faker.helpers.arrayElement(organizers).id,
          eventId: faker.helpers.arrayElement(events).id,
        },
      })
    )
  );

  // Create Tickets Payments
  await Promise.all(
    Array(150).fill(null).map(() =>
      prisma.ticketsPayment.create({
        data: {
          amount: randomFloat(10, 500),
          screenshotUrl: faker.image.urlLoremFlickr({ category: 'payment' }),
          qrCodeUrl: faker.internet.url(),
          quantity: faker.number.int({ min: 1, max: 5 }),
          status: faker.helpers.arrayElement(Object.values(PaymentStatus)),
          userId: faker.helpers.arrayElement(users).id,
          eventId: faker.helpers.arrayElement(events).id,
        },
      })
    )
  );

  // Create Favorites
  await Promise.all(
    Array(200).fill(null).map(async () => {
      try {
        return await prisma.favorite.create({
          data: {
            userId: faker.helpers.arrayElement(users).id,
            eventId: faker.helpers.arrayElement(events).id,
          },
        });
      } catch (error) {
        // Ignore unique constraint violations
        if (error.code !== 'P2002') throw error;
      }
    })
  );

  // Create Notifications
  await Promise.all(
    Array(300).fill(null).map(() => {
      const targetType = faker.helpers.arrayElement(['user', 'organizer', 'admin']);
      const data: any = {
        message: faker.lorem.sentence(),
      };

      if (targetType === 'user') {
        data.userId = faker.helpers.arrayElement(users).id;
      } else if (targetType === 'organizer') {
        data.organizerId = faker.helpers.arrayElement(organizers).id;
      } else {
        data.adminId = admin.id;
      }

      return prisma.notification.create({ data });
    })
  );

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 