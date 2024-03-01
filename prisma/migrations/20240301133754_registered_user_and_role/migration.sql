-- CreateTable
CREATE TABLE "registered_users" (
    "user_id" TEXT NOT NULL,
    "full_name" VARCHAR(50) NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "package_type" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "registered_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "registered_users_email_key" ON "registered_users"("email");

-- AddForeignKey
ALTER TABLE "registered_users" ADD CONSTRAINT "registered_users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;
