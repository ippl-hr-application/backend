-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "job_positions" (
    "job_position_id" SERIAL NOT NULL,
    "company_branch_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "job_positions_pkey" PRIMARY KEY ("job_position_id")
);

-- CreateTable
CREATE TABLE "employment_statuses" (
    "employment_status_id" SERIAL NOT NULL,
    "company_branch_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "employment_statuses_pkey" PRIMARY KEY ("employment_status_id")
);

-- CreateTable
CREATE TABLE "employees" (
    "employee_id" TEXT NOT NULL,
    "company_branch_id" INTEGER NOT NULL,
    "job_position_id" INTEGER NOT NULL,
    "employment_status_id" INTEGER NOT NULL,
    "unique_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "place_of_birth" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "marital_status" VARCHAR(20) NOT NULL,
    "blood_type" VARCHAR(3) NOT NULL,
    "religion" VARCHAR(20) NOT NULL,
    "identity_type" VARCHAR(20) NOT NULL,
    "identity_number" VARCHAR(20) NOT NULL,
    "identity_expired_date" DATE NOT NULL,
    "postcal_code" VARCHAR(10) NOT NULL,
    "citizen_id_address" TEXT NOT NULL,
    "residential_address" TEXT NOT NULL,
    "bank_account_number" VARCHAR(20),
    "bank_type" VARCHAR(20),
    "wage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "employee_tasks" (
    "task_id" SERIAL NOT NULL,
    "company_branch_id" INTEGER NOT NULL,
    "employee_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "given_by_id" TEXT NOT NULL,

    CONSTRAINT "employee_tasks_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "employee_files" (
    "employee_file_id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_for" VARCHAR(20),

    CONSTRAINT "employee_files_pkey" PRIMARY KEY ("employee_file_id")
);

-- CreateTable
CREATE TABLE "reimbursements" (
    "reimbursement_id" SERIAL NOT NULL,
    "company_branch_id" INTEGER NOT NULL,
    "employee_id" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "reimbursements_pkey" PRIMARY KEY ("reimbursement_id")
);

-- CreateTable
CREATE TABLE "reimbursement_file_attachments" (
    "reimbursement_id" INTEGER NOT NULL,
    "employee_file_id" INTEGER NOT NULL,

    CONSTRAINT "reimbursement_file_attachments_pkey" PRIMARY KEY ("reimbursement_id")
);

-- CreateTable
CREATE TABLE "shifts" (
    "shift_id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("shift_id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "attendance_id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "shift_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "check_in" TEXT NOT NULL,
    "check_out" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("attendance_id")
);

-- CreateTable
CREATE TABLE "attendance_file_attachments" (
    "attendance_id" INTEGER NOT NULL,
    "employee_file_id" INTEGER NOT NULL,

    CONSTRAINT "attendance_file_attachments_pkey" PRIMARY KEY ("attendance_id","employee_file_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_unique_id_key" ON "employees"("unique_id");

-- AddForeignKey
ALTER TABLE "job_positions" ADD CONSTRAINT "job_positions_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employment_statuses" ADD CONSTRAINT "employment_statuses_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_job_position_id_fkey" FOREIGN KEY ("job_position_id") REFERENCES "job_positions"("job_position_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_employment_status_id_fkey" FOREIGN KEY ("employment_status_id") REFERENCES "employment_statuses"("employment_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_tasks" ADD CONSTRAINT "employee_tasks_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_tasks" ADD CONSTRAINT "employee_tasks_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_tasks" ADD CONSTRAINT "employee_tasks_given_by_id_fkey" FOREIGN KEY ("given_by_id") REFERENCES "employees"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_files" ADD CONSTRAINT "employee_files_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reimbursements" ADD CONSTRAINT "reimbursements_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reimbursements" ADD CONSTRAINT "reimbursements_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reimbursement_file_attachments" ADD CONSTRAINT "reimbursement_file_attachments_reimbursement_id_fkey" FOREIGN KEY ("reimbursement_id") REFERENCES "reimbursements"("reimbursement_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reimbursement_file_attachments" ADD CONSTRAINT "reimbursement_file_attachments_employee_file_id_fkey" FOREIGN KEY ("employee_file_id") REFERENCES "employee_files"("employee_file_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shifts"("shift_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_file_attachments" ADD CONSTRAINT "attendance_file_attachments_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "attendances"("attendance_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_file_attachments" ADD CONSTRAINT "attendance_file_attachments_employee_file_id_fkey" FOREIGN KEY ("employee_file_id") REFERENCES "employee_files"("employee_file_id") ON DELETE RESTRICT ON UPDATE CASCADE;
