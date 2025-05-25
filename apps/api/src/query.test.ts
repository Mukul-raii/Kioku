import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function main() {
  const quickTestId = 1;

  const quickTestData = await prisma.quickQuiz.findFirst({
    where: {
      id: quickTestId
    },
    include: {
      review: {
        include: {
          testResult: true
        }
      }
    }
  });

  console.log(quickTestData);
}

