/*
  Warnings:

  - You are about to drop the `mutatiton_submission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mutatiton_submission" DROP CONSTRAINT "mutatiton_submission_employee_file_id_fkey";

-- DropTable
DROP TABLE "mutatiton_submission";

-- CreateTable
CREATE TABLE "mutation_submission" (
    "mutation_permission_id" SERIAL NOT NULL,
    "employee_file_id" INTEGER NOT NULL,
    "mutation_reason" VARCHAR(100) NOT NULL,

    CONSTRAINT "mutation_submission_pkey" PRIMARY KEY ("mutation_permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mutation_submission_employee_file_id_key" ON "mutation_submission"("employee_file_id");

-- AddForeignKey
ALTER TABLE "mutation_submission" ADD CONSTRAINT "mutation_submission_employee_file_id_fkey" FOREIGN KEY ("employee_file_id") REFERENCES "employee_files"("employee_file_id") ON DELETE RESTRICT ON UPDATE CASCADE;
