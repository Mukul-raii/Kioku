/*
  Warnings:

  - You are about to drop the column `notes` on the `QuickQuiz` table. All the data in the column will be lost.
  - Added the required column `scheduledDate` to the `QuickQuiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuickQuiz" DROP COLUMN "notes",
ADD COLUMN     "scheduledDate" TIMESTAMP(3) NOT NULL;
