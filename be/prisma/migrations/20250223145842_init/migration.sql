-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(50) NOT NULL,
    "internal_id" VARCHAR(10) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "fullname" VARCHAR(100) NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "modified_by" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(50) NOT NULL,
    "internal_id" VARCHAR(10) NOT NULL,
    "fullname" VARCHAR(100),
    "nickname" VARCHAR(50),
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "password" VARCHAR(255) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'onreview',
    "modified_by" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_profile" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "member_uuid" VARCHAR(50) NOT NULL,
    "gender" VARCHAR(10),
    "nationality" VARCHAR(50),
    "citizen_id" VARCHAR(50),
    "religion" VARCHAR(50),
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "member_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_uuid_key" ON "admins"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "admins_internal_id_key" ON "admins"("internal_id");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE INDEX "idx_admin_fullname" ON "admins"("fullname");

-- CreateIndex
CREATE INDEX "idx_admin_nickname" ON "admins"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "members_uuid_key" ON "members"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "members_internal_id_key" ON "members"("internal_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_phone_key" ON "members"("phone");

-- CreateIndex
CREATE INDEX "idx_member_fullname" ON "members"("fullname");

-- CreateIndex
CREATE INDEX "idx_member_nickname" ON "members"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "member_profile_member_id_key" ON "member_profile"("member_id");

-- CreateIndex
CREATE UNIQUE INDEX "member_profile_member_uuid_key" ON "member_profile"("member_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "member_profile_citizen_id_key" ON "member_profile"("citizen_id");

-- CreateIndex
CREATE INDEX "idx_member_citizen_id" ON "member_profile"("citizen_id");

-- CreateIndex
CREATE INDEX "idx_category_name" ON "categories"("name");

-- AddForeignKey
ALTER TABLE "member_profile" ADD CONSTRAINT "member_profile_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
