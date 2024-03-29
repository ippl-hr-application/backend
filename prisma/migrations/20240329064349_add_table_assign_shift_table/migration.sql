/*
  Warnings:

  - You are about to drop the column `employee_file_id` on the `mutation_submission` table. All the data in the column will be lost.
  - You are about to drop the column `employee_file_id` on the `permission_submission` table. All the data in the column will be lost.
  - You are about to drop the column `employee_id` on the `shifts` table. All the data in the column will be lost.
  - You are about to drop the `leave_permission` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[employee_file_id]` on the table `submissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company_branch_id` to the `shifts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `shifts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_file_id` to the `submissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "leave_permission" DROP CONSTRAINT "leave_permission_employee_file_id_fkey";

-- DropForeignKey
ALTER TABLE "leave_permission" DROP CONSTRAINT "leave_permission_submision_id_fkey";

-- DropForeignKey
ALTER TABLE "mutation_submission" DROP CONSTRAINT "mutation_submission_employee_file_id_fkey";

-- DropForeignKey
ALTER TABLE "mutation_submission" DROP CONSTRAINT "mutation_submission_submision_id_fkey";

-- DropForeignKey
ALTER TABLE "permission_submission" DROP CONSTRAINT "permission_submission_employee_file_id_fkey";

-- DropForeignKey
ALTER TABLE "permission_submission" DROP CONSTRAINT "permission_submission_submision_id_fkey";

-- DropForeignKey
ALTER TABLE "shifts" DROP CONSTRAINT "shifts_employee_id_fkey";

-- DropIndex
DROP INDEX "mutation_submission_employee_file_id_key";

-- DropIndex
DROP INDEX "permission_submission_employee_file_id_key";

-- AlterTable
ALTER TABLE "mutation_submission" DROP COLUMN "employee_file_id";

-- AlterTable
ALTER TABLE "permission_submission" DROP COLUMN "employee_file_id";

-- AlterTable
ALTER TABLE "shifts" DROP COLUMN "employee_id",
ADD COLUMN     "company_branch_id" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "employee_file_id" INTEGER NOT NULL,
ALTER COLUMN "type" SET DATA TYPE VARCHAR(50);

-- DropTable
DROP TABLE "leave_permission";

-- DropEnum
DROP TYPE "AttendanceStatus";

-- CreateTable
CREATE TABLE "AssignShift" (
    "assign_shift_id" SERIAL NOT NULL,
    "shift_id" INTEGER NOT NULL,
    "employee_id" TEXT NOT NULL,

    CONSTRAINT "AssignShift_pkey" PRIMARY KEY ("assign_shift_id")
);

-- CreateTable
CREATE TABLE "leave_submission" (
    "leave_permission_id" SERIAL NOT NULL,
    "submision_id" INTEGER NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "leave_reason" VARCHAR(100) NOT NULL,

    CONSTRAINT "leave_submission_pkey" PRIMARY KEY ("leave_permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leave_submission_submision_id_key" ON "leave_submission"("submision_id");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_employee_file_id_key" ON "submissions"("employee_file_id");

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignShift" ADD CONSTRAINT "AssignShift_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shifts"("shift_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignShift" ADD CONSTRAINT "AssignShift_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_employee_file_id_fkey" FOREIGN KEY ("employee_file_id") REFERENCES "employee_files"("employee_file_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_submission" ADD CONSTRAINT "permission_submission_submision_id_fkey" FOREIGN KEY ("submision_id") REFERENCES "submissions"("submission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_submission" ADD CONSTRAINT "leave_submission_submision_id_fkey" FOREIGN KEY ("submision_id") REFERENCES "submissions"("submission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutation_submission" ADD CONSTRAINT "mutation_submission_submision_id_fkey" FOREIGN KEY ("submision_id") REFERENCES "submissions"("submission_id") ON DELETE CASCADE ON UPDATE CASCADE;
