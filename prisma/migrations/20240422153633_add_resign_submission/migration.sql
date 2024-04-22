/*
  Warnings:

  - The `package_type` column on the `companies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `AssignShift` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChangeShiftSubmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('FREE', 'PREMIUM');

-- DropForeignKey
ALTER TABLE "AssignShift" DROP CONSTRAINT "AssignShift_company_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "AssignShift" DROP CONSTRAINT "AssignShift_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "AssignShift" DROP CONSTRAINT "AssignShift_shift_id_fkey";

-- DropForeignKey
ALTER TABLE "ChangeShiftSubmission" DROP CONSTRAINT "ChangeShiftSubmission_current_shift_id_fkey";

-- DropForeignKey
ALTER TABLE "ChangeShiftSubmission" DROP CONSTRAINT "ChangeShiftSubmission_submision_id_fkey";

-- DropForeignKey
ALTER TABLE "ChangeShiftSubmission" DROP CONSTRAINT "ChangeShiftSubmission_target_shift_id_fkey";

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "package_end" TIMESTAMP(3),
DROP COLUMN "package_type",
ADD COLUMN     "package_type" "PackageType" NOT NULL DEFAULT 'PREMIUM';

-- DropTable
DROP TABLE "AssignShift";

-- DropTable
DROP TABLE "ChangeShiftSubmission";

-- CreateTable
CREATE TABLE "company_file_templates" (
    "company_file_template_id" SERIAL NOT NULL,
    "company_id" TEXT NOT NULL,
    "company_file_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "company_file_templates_pkey" PRIMARY KEY ("company_file_template_id")
);

-- CreateTable
CREATE TABLE "assign_shifts" (
    "assign_shift_id" SERIAL NOT NULL,
    "shift_id" INTEGER NOT NULL,
    "employee_id" TEXT NOT NULL,
    "company_branch_id" TEXT NOT NULL,
    "target_date" DATE,

    CONSTRAINT "assign_shifts_pkey" PRIMARY KEY ("assign_shift_id")
);

-- CreateTable
CREATE TABLE "change_shift_submission" (
    "change_shift_permission_id" SERIAL NOT NULL,
    "submision_id" INTEGER NOT NULL,
    "current_shift_id" INTEGER NOT NULL,
    "target_shift_id" INTEGER NOT NULL,
    "target_date" DATE NOT NULL,
    "reason" VARCHAR(100) NOT NULL,

    CONSTRAINT "change_shift_submission_pkey" PRIMARY KEY ("change_shift_permission_id")
);

-- CreateTable
CREATE TABLE "resign_submission" (
    "resign_submission_id" SERIAL NOT NULL,
    "submision_id" INTEGER NOT NULL,
    "reason" VARCHAR(100) NOT NULL,

    CONSTRAINT "resign_submission_pkey" PRIMARY KEY ("resign_submission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_file_templates_company_file_id_key" ON "company_file_templates"("company_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "change_shift_submission_submision_id_key" ON "change_shift_submission"("submision_id");

-- CreateIndex
CREATE UNIQUE INDEX "resign_submission_submision_id_key" ON "resign_submission"("submision_id");

-- AddForeignKey
ALTER TABLE "company_file_templates" ADD CONSTRAINT "company_file_templates_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_file_templates" ADD CONSTRAINT "company_file_templates_company_file_id_fkey" FOREIGN KEY ("company_file_id") REFERENCES "company_files"("company_file_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assign_shifts" ADD CONSTRAINT "assign_shifts_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shifts"("shift_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assign_shifts" ADD CONSTRAINT "assign_shifts_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assign_shifts" ADD CONSTRAINT "assign_shifts_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_shift_submission" ADD CONSTRAINT "change_shift_submission_submision_id_fkey" FOREIGN KEY ("submision_id") REFERENCES "submissions"("submission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_shift_submission" ADD CONSTRAINT "change_shift_submission_current_shift_id_fkey" FOREIGN KEY ("current_shift_id") REFERENCES "shifts"("shift_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "change_shift_submission" ADD CONSTRAINT "change_shift_submission_target_shift_id_fkey" FOREIGN KEY ("target_shift_id") REFERENCES "shifts"("shift_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resign_submission" ADD CONSTRAINT "resign_submission_submision_id_fkey" FOREIGN KEY ("submision_id") REFERENCES "submissions"("submission_id") ON DELETE CASCADE ON UPDATE CASCADE;
