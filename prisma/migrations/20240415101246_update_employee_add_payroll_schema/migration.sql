/*
  Warnings:

  - Added the required column `gender` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `join_date` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "delete_at" DATE,
ADD COLUMN     "gender" VARCHAR NOT NULL,
ADD COLUMN     "join_date" DATE NOT NULL,
ADD COLUMN     "resign_date" DATE;

-- CreateTable
CREATE TABLE "payrolls" (
    "payroll_id" SERIAL NOT NULL,
    "company_branch_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "month" SMALLINT NOT NULL,
    "year" SMALLINT NOT NULL,
    "wage" DOUBLE PRECISION NOT NULL,
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "payrolls_pkey" PRIMARY KEY ("payroll_id")
);

-- AddForeignKey
ALTER TABLE "payrolls" ADD CONSTRAINT "payrolls_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payrolls" ADD CONSTRAINT "payrolls_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;
