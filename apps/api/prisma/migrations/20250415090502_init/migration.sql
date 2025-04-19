/*
  Warnings:

  - Added the required column `category` to the `LearningLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LearningLog" DROP CONSTRAINT "LearningLog_categoryId_fkey";

-- AlterTable
ALTER TABLE "LearningLog" ADD COLUMN     "category" TEXT NOT NULL,
ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LearningLog" ADD CONSTRAINT "LearningLog_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
