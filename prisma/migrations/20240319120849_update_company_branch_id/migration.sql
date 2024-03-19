/*
  Warnings:

  - The primary key for the `company_announcement_to` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `company_branches` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "company_announcement_to" DROP CONSTRAINT "company_announcement_to_company_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "employee_tasks" DROP CONSTRAINT "employee_tasks_company_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_company_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "employment_statuses" DROP CONSTRAINT "employment_statuses_company_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "job_positions" DROP CONSTRAINT "job_positions_company_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "reimbursements" DROP CONSTRAINT "reimbursements_company_branch_id_fkey";

-- AlterTable
ALTER TABLE "company_announcement_to" DROP CONSTRAINT "company_announcement_to_pkey",
ALTER COLUMN "company_branch_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "company_announcement_to_pkey" PRIMARY KEY ("company_branch_id", "company_announcement_id");

-- AlterTable
ALTER TABLE "company_branches" DROP CONSTRAINT "company_branches_pkey",
ALTER COLUMN "company_branch_id" DROP DEFAULT,
ALTER COLUMN "company_branch_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "company_branches_pkey" PRIMARY KEY ("company_branch_id");
DROP SEQUENCE "company_branches_company_branch_id_seq";

-- AlterTable
ALTER TABLE "employee_tasks" ALTER COLUMN "company_branch_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "company_branch_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "employment_statuses" ALTER COLUMN "company_branch_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "job_positions" ALTER COLUMN "company_branch_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "reimbursements" ALTER COLUMN "company_branch_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "company_announcement_to" ADD CONSTRAINT "company_announcement_to_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_positions" ADD CONSTRAINT "job_positions_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employment_statuses" ADD CONSTRAINT "employment_statuses_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_tasks" ADD CONSTRAINT "employee_tasks_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reimbursements" ADD CONSTRAINT "reimbursements_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;
