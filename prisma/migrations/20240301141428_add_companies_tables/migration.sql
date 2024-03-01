-- CreateTable
CREATE TABLE "companies" (
    "company_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "npwp_digit" VARCHAR(16),

    CONSTRAINT "companies_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "company_branches" (
    "company_branch_id" SERIAL NOT NULL,
    "company_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "province" VARCHAR(50) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "size" INTEGER NOT NULL,
    "hq_initial" VARCHAR(50) NOT NULL,
    "hq_code" VARCHAR(50) NOT NULL,
    "umr" DOUBLE PRECISION NOT NULL,
    "umr_province" DOUBLE PRECISION NOT NULL,
    "umr_city" DOUBLE PRECISION NOT NULL,
    "bpjs" VARCHAR(50) NOT NULL,

    CONSTRAINT "company_branches_pkey" PRIMARY KEY ("company_branch_id")
);

-- CreateTable
CREATE TABLE "company_logos" (
    "company_logo_id" SERIAL NOT NULL,
    "company_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_url" TEXT NOT NULL,

    CONSTRAINT "company_logos_pkey" PRIMARY KEY ("company_logo_id")
);

-- CreateTable
CREATE TABLE "company_files" (
    "company_file_id" SERIAL NOT NULL,
    "company_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "company_files_pkey" PRIMARY KEY ("company_file_id")
);

-- CreateTable
CREATE TABLE "company_announcements" (
    "company_announcement_id" SERIAL NOT NULL,
    "company_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "company_announcements_pkey" PRIMARY KEY ("company_announcement_id")
);

-- CreateTable
CREATE TABLE "company_announcement_to" (
    "company_branch_id" INTEGER NOT NULL,
    "company_announcement_id" INTEGER NOT NULL,

    CONSTRAINT "company_announcement_to_pkey" PRIMARY KEY ("company_branch_id","company_announcement_id")
);

-- CreateTable
CREATE TABLE "company_announcement_file_attachements" (
    "company_announcement_id" INTEGER NOT NULL,
    "company_file_id" INTEGER NOT NULL,

    CONSTRAINT "company_announcement_file_attachements_pkey" PRIMARY KEY ("company_announcement_id","company_file_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_user_id_key" ON "companies"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_branches_company_id_key" ON "company_branches"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_logos_company_id_key" ON "company_logos"("company_id");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "registered_users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_branches" ADD CONSTRAINT "company_branches_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_logos" ADD CONSTRAINT "company_logos_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_files" ADD CONSTRAINT "company_files_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_announcements" ADD CONSTRAINT "company_announcements_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_announcement_to" ADD CONSTRAINT "company_announcement_to_company_branch_id_fkey" FOREIGN KEY ("company_branch_id") REFERENCES "company_branches"("company_branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_announcement_to" ADD CONSTRAINT "company_announcement_to_company_announcement_id_fkey" FOREIGN KEY ("company_announcement_id") REFERENCES "company_announcements"("company_announcement_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_announcement_file_attachements" ADD CONSTRAINT "company_announcement_file_attachements_company_announcemen_fkey" FOREIGN KEY ("company_announcement_id") REFERENCES "company_announcements"("company_announcement_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_announcement_file_attachements" ADD CONSTRAINT "company_announcement_file_attachements_company_file_id_fkey" FOREIGN KEY ("company_file_id") REFERENCES "company_files"("company_file_id") ON DELETE RESTRICT ON UPDATE CASCADE;
