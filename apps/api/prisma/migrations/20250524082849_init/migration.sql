/*
  Warnings:

  - You are about to drop the `CustomTest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomTest" DROP CONSTRAINT "CustomTest_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CustomTest" DROP CONSTRAINT "CustomTest_userId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_testId_fkey";

-- DropTable
DROP TABLE "CustomTest";

-- CreateTable
CREATE TABLE "QuickQuiz" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "updateDate" TIMESTAMP(3) NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER,

    CONSTRAINT "QuickQuiz_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuickQuiz" ADD CONSTRAINT "QuickQuiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickQuiz" ADD CONSTRAINT "QuickQuiz_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_testId_fkey" FOREIGN KEY ("testId") REFERENCES "QuickQuiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;
