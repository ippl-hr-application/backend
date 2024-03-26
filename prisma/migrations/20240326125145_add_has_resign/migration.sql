/*
  Warnings:

  - Made the column `hq_initial` on table `company_branches` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "company_branches" ALTER COLUMN "hq_initial" SET NOT NULL;

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "hasResigned" BOOLEAN NOT NULL DEFAULT false;
