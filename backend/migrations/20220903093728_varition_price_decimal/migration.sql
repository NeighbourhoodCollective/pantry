/*
  Warnings:

  - You are about to alter the column `price` on the `Variation` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(4,2)`.

*/
-- AlterTable
ALTER TABLE "Variation" ALTER COLUMN "price" SET DATA TYPE DECIMAL(4,2);
