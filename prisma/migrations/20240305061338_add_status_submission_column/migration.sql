/*
  Warnings:

  - Added the required column `status` to the `leave_permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `mutation_submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `permission_submission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('ACCEPTED', 'PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "leave_permission" ADD COLUMN     "status" "SubmissionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "mutation_submission" ADD COLUMN     "status" "SubmissionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "permission_submission" ADD COLUMN     "status" "SubmissionStatus" NOT NULL;
