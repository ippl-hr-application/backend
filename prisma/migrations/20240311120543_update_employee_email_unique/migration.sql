/*
  Warnings:

  - The primary key for the `reimbursement_file_attachments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[email]` on the table `employees` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "reimbursement_file_attachments" DROP CONSTRAINT "reimbursement_file_attachments_pkey",
ADD CONSTRAINT "reimbursement_file_attachments_pkey" PRIMARY KEY ("reimbursement_id", "employee_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");
