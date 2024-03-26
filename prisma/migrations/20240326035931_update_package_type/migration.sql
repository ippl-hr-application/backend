/*
  Warnings:

  - You are about to drop the column `package_type` on the `registered_users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "company_branches_company_id_key";

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "package_type" TEXT NOT NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE "registered_users" DROP COLUMN "package_type";
