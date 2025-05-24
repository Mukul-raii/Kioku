/*
  Warnings:

  - You are about to drop the column `createdDate` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `LearningLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedDate` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LearningLog" DROP CONSTRAINT "LearningLog_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "LearningLog" DROP CONSTRAINT "LearningLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_logId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "createdDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "testId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "logId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedDate" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "LearningLog";

-- CreateTable
CREATE TABLE "LearningNote" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "updateDate" TIMESTAMP(3) NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER,

    CONSTRAINT "LearningNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomTest" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "updateDate" TIMESTAMP(3) NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER,

    CONSTRAINT "CustomTest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LearningNote" ADD CONSTRAINT "LearningNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningNote" ADD CONSTRAINT "LearningNote_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomTest" ADD CONSTRAINT "CustomTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomTest" ADD CONSTRAINT "CustomTest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_logId_fkey" FOREIGN KEY ("logId") REFERENCES "LearningNote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_testId_fkey" FOREIGN KEY ("testId") REFERENCES "CustomTest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
