/*
  Warnings:

  - You are about to drop the column `check_in` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `check_out` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `leave_permission` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `mutation_submission` table. All the data in the column will be lost.
  - You are about to drop the column `date_and_time` on the `permission_submission` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `permission_submission` table. All the data in the column will be lost.
  - You are about to drop the `attendance_file_attachments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[submision_id]` on the table `leave_permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[submision_id]` on the table `mutation_submission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[submision_id]` on the table `permission_submission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `submision_id` to the `leave_permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submision_id` to the `mutation_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from` to the `permission_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submision_id` to the `permission_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `permission_submission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttendanceCheckStatus" AS ENUM ('REJECTED', 'PENDING', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "AttendanceCheckType" AS ENUM ('CHECK_IN', 'CHECK_OUT');

-- DropForeignKey
ALTER TABLE "attendance_file_attachments" DROP CONSTRAINT "attendance_file_attachments_attendance_id_fkey";

-- DropForeignKey
ALTER TABLE "attendance_file_attachments" DROP CONSTRAINT "attendance_file_attachments_employee_file_id_fkey";

-- AlterTable
ALTER TABLE "attendances" DROP COLUMN "check_in",
DROP COLUMN "check_out",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "leave_permission" DROP COLUMN "status",
ADD COLUMN     "submision_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "mutation_submission" DROP COLUMN "status",
ADD COLUMN     "submision_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "permission_submission" DROP COLUMN "date_and_time",
DROP COLUMN "status",
ADD COLUMN     "from" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "submision_id" INTEGER NOT NULL,
ADD COLUMN     "to" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "attendance_file_attachments";

-- CreateTable
CREATE TABLE "attendance_checks" (
    "attendance_check_id" SERIAL NOT NULL,
    "attendance_id" INTEGER NOT NULL,
    "employee_file_id" INTEGER NOT NULL,
    "type" "AttendanceCheckType" NOT NULL,
    "time" TEXT NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "status" "AttendanceCheckStatus" NOT NULL,

    CONSTRAINT "attendance_checks_pkey" PRIMARY KEY ("attendance_check_id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "submission_id" SERIAL NOT NULL,
    "submission_date" TIMESTAMP(3) NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "employee_id" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("submission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attendance_checks_attendance_id_key" ON "attendance_checks"("attendance_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_checks_employee_file_id_key" ON "attendance_checks"("employee_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "leave_permission_submision_id_key" ON "leave_permission"("submision_id");

-- CreateIndex
CREATE UNIQUE INDEX "mutation_submission_submision_id_key" ON "mutation_submission"("submision_id");

-- CreateIndex
CREATE UNIQUE INDEX "permission_submission_submision_id_key" ON "permission_submission"("submision_id");

-- AddForeignKey
ALTER TABLE "attendance_checks" ADD CONSTRAINT "attendance_checks_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "attendances"("attendance_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_checks" ADD CONSTRAINT "attendance_checks_employee_file_id_fkey" FOREIGN KEY ("employee_file_id") REFERENCES "employee_files"("employee_file_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_submission" ADD CONSTRAINT "permission_submission_submision_id_fkey" FOREIGN KEY ("submision_id") REFERENCES "submissions"("submission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_permission" ADD CONSTRAINT "leave_permission_submision_id_fkey" FOREIGN KEY ("submision_id") REFERENCES "submissions"("submission_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutation_submission" ADD CONSTRAINT "mutation_submission_submision_id_fkey" FOREIGN KEY ("submision_id") REFERENCES "submissions"("submission_id") ON DELETE RESTRICT ON UPDATE CASCADE;
