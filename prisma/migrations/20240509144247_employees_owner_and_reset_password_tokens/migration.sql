/*
  Warnings:

  - You are about to drop the column `shift_id` on the `attendances` table. All the data in the column will be lost.
  - Added the required column `assign_shift_id` to the `attendances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `company_announcements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_shift_id_fkey";

-- DropForeignKey
ALTER TABLE "company_file_templates" DROP CONSTRAINT "company_file_templates_company_id_fkey";

-- DropIndex
DROP INDEX "attendance_checks_attendance_id_key";

-- DropIndex
DROP INDEX "employees_email_key";

-- AlterTable
ALTER TABLE "attendances" DROP COLUMN "shift_id",
ADD COLUMN     "assign_shift_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "companies" ALTER COLUMN "package_type" SET DEFAULT 'FREE';

-- AlterTable
ALTER TABLE "company_announcements" ADD COLUMN     "date" DATE NOT NULL;

-- CreateTable
CREATE TABLE "attendance_submission" (
    "attendance_submission_id" SERIAL NOT NULL,
    "submision_id" INTEGER NOT NULL,
    "attendance_id" INTEGER NOT NULL,
    "reason" VARCHAR(100) NOT NULL,

    CONSTRAINT "attendance_submission_pkey" PRIMARY KEY ("attendance_submission_id")
);

-- CreateTable
CREATE TABLE "reset_password_tokens" (
    "token_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reset_password_tokens_pkey" PRIMARY KEY ("token_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attendance_submission_submision_id_key" ON "attendance_submission"("submision_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_submission_attendance_id_key" ON "attendance_submission"("attendance_id");

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_tokens_token_key" ON "reset_password_tokens"("token");

-- AddForeignKey
ALTER TABLE "company_file_templates" ADD CONSTRAINT "company_file_templates_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_assign_shift_id_fkey" FOREIGN KEY ("assign_shift_id") REFERENCES "assign_shifts"("assign_shift_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_submission" ADD CONSTRAINT "attendance_submission_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "attendances"("attendance_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_submission" ADD CONSTRAINT "attendance_submission_submision_id_fkey" FOREIGN KEY ("submision_id") REFERENCES "submissions"("submission_id") ON DELETE CASCADE ON UPDATE CASCADE;
