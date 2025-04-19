/*
  Warnings:

  - You are about to drop the column `createdDate` on the `TestResults` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `TestResults` table. All the data in the column will be lost.
  - Added the required column `RepetitionCount` to the `TestResults` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentInterval` to the `TestResults` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastReviewed` to the `TestResults` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastScore` to the `TestResults` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextReviewDate` to the `TestResults` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestResults" DROP COLUMN "createdDate",
DROP COLUMN "score",
ADD COLUMN     "RepetitionCount" INTEGER NOT NULL,
ADD COLUMN     "currentInterval" INTEGER NOT NULL,
ADD COLUMN     "lastReviewed" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastScore" INTEGER NOT NULL,
ADD COLUMN     "nextReviewDate" TIMESTAMP(3) NOT NULL;
