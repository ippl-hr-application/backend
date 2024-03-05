/*
  Warnings:

  - You are about to drop the column `size` on the `companies` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('SAKIT', 'IZIN');

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "size",
ALTER COLUMN "industry" DROP NOT NULL;

-- AlterTable
ALTER TABLE "company_branches" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "province" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "size" DROP NOT NULL,
ALTER COLUMN "hq_initial" DROP NOT NULL,
ALTER COLUMN "hq_code" DROP NOT NULL,
ALTER COLUMN "umr" DROP NOT NULL,
ALTER COLUMN "umr_province" DROP NOT NULL,
ALTER COLUMN "umr_city" DROP NOT NULL,
ALTER COLUMN "bpjs" DROP NOT NULL;

-- CreateTable
CREATE TABLE "permission_submission" (
    "permission_submission_id" SERIAL NOT NULL,
    "employee_file_id" INTEGER NOT NULL,
    "date_and_time" TIMESTAMP(3) NOT NULL,
    "permission_reason" VARCHAR(100) NOT NULL,
    "type" "PermissionType" NOT NULL,

    CONSTRAINT "permission_submission_pkey" PRIMARY KEY ("permission_submission_id")
);

-- CreateTable
CREATE TABLE "leave_permission" (
    "leave_permission_id" SERIAL NOT NULL,
    "employee_file_id" INTEGER NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "leave_reason" VARCHAR(100) NOT NULL,
    "leave_type" VARCHAR(10) NOT NULL,

    CONSTRAINT "leave_permission_pkey" PRIMARY KEY ("leave_permission_id")
);

-- CreateTable
CREATE TABLE "mutatiton_submission" (
    "mutation_permission_id" SERIAL NOT NULL,
    "employee_file_id" INTEGER NOT NULL,
    "mutation_reason" VARCHAR(100) NOT NULL,

    CONSTRAINT "mutatiton_submission_pkey" PRIMARY KEY ("mutation_permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permission_submission_employee_file_id_key" ON "permission_submission"("employee_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "leave_permission_employee_file_id_key" ON "leave_permission"("employee_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "mutatiton_submission_employee_file_id_key" ON "mutatiton_submission"("employee_file_id");

-- AddForeignKey
ALTER TABLE "permission_submission" ADD CONSTRAINT "permission_submission_employee_file_id_fkey" FOREIGN KEY ("employee_file_id") REFERENCES "employee_files"("employee_file_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_permission" ADD CONSTRAINT "leave_permission_employee_file_id_fkey" FOREIGN KEY ("employee_file_id") REFERENCES "employee_files"("employee_file_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutatiton_submission" ADD CONSTRAINT "mutatiton_submission_employee_file_id_fkey" FOREIGN KEY ("employee_file_id") REFERENCES "employee_files"("employee_file_id") ON DELETE RESTRICT ON UPDATE CASCADE;
