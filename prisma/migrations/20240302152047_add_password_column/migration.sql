/*
  Warnings:

  - Added the required column `password` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `registered_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "registered_users" ADD COLUMN     "password" TEXT NOT NULL;
