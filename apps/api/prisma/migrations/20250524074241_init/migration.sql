/*
  Warnings:

  - A unique constraint covering the columns `[catergoryName]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_catergoryName_key" ON "Category"("catergoryName");
