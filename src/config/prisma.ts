import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
    try {
      await prisma.$connect(); // Correct method to connect
      console.log('Connected to the database!');
    } catch (error) {
      // console.error('Failed to connect to the database:', error);
    } 
  })();

export default prisma;