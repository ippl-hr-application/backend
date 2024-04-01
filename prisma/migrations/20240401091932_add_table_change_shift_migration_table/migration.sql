/*
  Warnings:

  - Added the required column `company_branch_id` to the `AssignShift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_company_branch_id` to the `mutation_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_company_branch_id` to the `mutation_submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssignShift" ADD COLUMN     "company_branch_id" TEXT NOT NULL,
ADD COLUMN     "target_date" DATE;

-- AlterTable
ALTER TABLE "mutation_submission" ADD COLUMN     "current_company_branch_id" TEXT NOT NULL,
ADD COLUMN     "target_company_branch_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "submissions" ALTER COLUMN "employee_file_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ChangeShiftSubmission" (
    "change_shift_permission_id" SERIAL NOT NULL,
    "submision_id" INTEGER NOT NULL,
    "current_shift_id" INTEGER NOT NULL,
    "target_shift_id" INTEGER NOT NULL,
    "target_date" DATE NOT NULL,

    CONSTRAINT "ChangeShiftSubmission_pkey" PRIMARY KEY ("change_shift_permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChangeShiftSubmission_submision_id_key" ON "ChangeShiftSubmission"("submision_id");

-- AddForeignKey
ALTER TABLE "AssignShift" ADD CONSTRAINT "AssignShift_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutation_submission" ADD CONSTRAINT "mutation_submission_current_company_branch_id_fkey" FOREIGN KEY ("current_company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutation_submission" ADD CONSTRAINT "mutation_submission_target_company_branch_id_fkey" FOREIGN KEY ("target_company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeShiftSubmission" ADD CONSTRAINT "ChangeShiftSubmission_submision_id_fkey" FOREIGN KEY ("submision_id") REFERENCES "submissions"("submission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeShiftSubmission" ADD CONSTRAINT "ChangeShiftSubmission_current_shift_id_fkey" FOREIGN KEY ("current_shift_id") REFERENCES "shifts"("shift_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeShiftSubmission" ADD CONSTRAINT "ChangeShiftSubmission_target_shift_id_fkey" FOREIGN KEY ("target_shift_id") REFERENCES "shifts"("shift_id") ON DELETE RESTRICT ON UPDATE CASCADE;
