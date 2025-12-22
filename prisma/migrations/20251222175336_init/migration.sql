-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('INQUIRY', 'CONTRACT_OUT', 'BOOKED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventForm" AS ENUM ('YES', 'NO', 'N_A');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PRODUCTION', 'SERVICE', 'MERCHANDISE', 'ENTERTAINER_MUSIC', 'ENTERTAINER_NON_MUSIC');

-- CreateTable
CREATE TABLE "category" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_type" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "event_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255),
    "gross_price" INTEGER,
    "fee_percent" INTEGER,
    "enabled" BOOLEAN DEFAULT true,
    "note" TEXT,
    "type" "ProductType",
    "special_requirements" VARCHAR(255),
    "description" TEXT,
    "booking_contact_id" VARCHAR(36),
    "agent_id" VARCHAR(36),
    "leader_id" VARCHAR(36),

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMP,
    "created_by" VARCHAR(36),
    "owner_id" VARCHAR(36),
    "done_at" TIMESTAMP,
    "complete" BOOLEAN,
    "note" TEXT,
    "agent_id" VARCHAR(36),

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255),
    "budget" INTEGER,
    "location" VARCHAR(255),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "contract_sent_date" TIMESTAMP,
    "contract_return_date" TIMESTAMP,
    "status" "EventStatus",
    "form" "EventForm",
    "note" TEXT,
    "attendance" INTEGER,
    "report_to" VARCHAR(255),
    "agent_id" VARCHAR(36),
    "event_type_id" VARCHAR(36),
    "client_org_id" VARCHAR(36),
    "client_contact_id" VARCHAR(36),
    "billing_contact_id" VARCHAR(36),
    "venue_id" VARCHAR(36),

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMP,
    "last_modification" TIMESTAMP,
    "enabled" BOOLEAN,
    "off_image" VARCHAR(255),
    "image_id" VARCHAR(36),
    "last_login" TIMESTAMP,
    "inserted" VARCHAR(36),
    "phone" VARCHAR(50),
    "email" VARCHAR(255),
    "push_notification_allowed" BOOLEAN,
    "username" VARCHAR(255),
    "password" VARCHAR(255),
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "modified" VARCHAR(36),
    "mod" VARCHAR(36),
    "admin_notes" TEXT,
    "address" VARCHAR(36),
    "agent_id" VARCHAR(36),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255),
    "address1" VARCHAR(255),
    "address2" VARCHAR(255),
    "city" VARCHAR(255),
    "state" VARCHAR(255),
    "zip" VARCHAR(20),
    "country" VARCHAR(255),
    "note" TEXT,
    "address_id" VARCHAR(36),
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "type" VARCHAR(255),
    "resources" VARCHAR(255),
    "created_by" VARCHAR(36),
    "contact_id" VARCHAR(36),
    "agent_id" VARCHAR(36),

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_point" (
    "id" VARCHAR(36) NOT NULL,
    "type" VARCHAR(255),
    "value" VARCHAR(255),
    "contact_id" VARCHAR(36),
    "organization_id" VARCHAR(36),

    CONSTRAINT "contact_point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_product" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255),
    "enabled" BOOLEAN DEFAULT true,
    "event_id" VARCHAR(36) NOT NULL,
    "product_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "event_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255),
    "address" VARCHAR(255),
    "address2" VARCHAR(255),
    "city" VARCHAR(255),
    "state" VARCHAR(255),
    "zip" VARCHAR(20),
    "country" VARCHAR(255),
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" VARCHAR(36) NOT NULL,
    "created_by" VARCHAR(36),
    "created_at" TIMESTAMP,
    "modified_at" TIMESTAMP,
    "modified" VARCHAR(36),
    "amount" DECIMAL(10,2),
    "reference_number" VARCHAR(255),
    "user_id" VARCHAR(36),
    "organization_id" VARCHAR(36),

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToProduct" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL,

    CONSTRAINT "_CategoryToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductToTask" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL,

    CONSTRAINT "_ProductToTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TaskToUser" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL,

    CONSTRAINT "_TaskToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EventTasks" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL,

    CONSTRAINT "_EventTasks_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EventContacts" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL,

    CONSTRAINT "_EventContacts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OrganizationToTask" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL,

    CONSTRAINT "_OrganizationToTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OrganizationToUser" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL,

    CONSTRAINT "_OrganizationToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductToContactPoint" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL,

    CONSTRAINT "_ProductToContactPoint_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserToRole" (
    "A" VARCHAR(36) NOT NULL,
    "B" VARCHAR(36) NOT NULL,

    CONSTRAINT "_UserToRole_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToProduct_B_index" ON "_CategoryToProduct"("B");

-- CreateIndex
CREATE INDEX "_ProductToTask_B_index" ON "_ProductToTask"("B");

-- CreateIndex
CREATE INDEX "_TaskToUser_B_index" ON "_TaskToUser"("B");

-- CreateIndex
CREATE INDEX "_EventTasks_B_index" ON "_EventTasks"("B");

-- CreateIndex
CREATE INDEX "_EventContacts_B_index" ON "_EventContacts"("B");

-- CreateIndex
CREATE INDEX "_OrganizationToTask_B_index" ON "_OrganizationToTask"("B");

-- CreateIndex
CREATE INDEX "_OrganizationToUser_B_index" ON "_OrganizationToUser"("B");

-- CreateIndex
CREATE INDEX "_ProductToContactPoint_B_index" ON "_ProductToContactPoint"("B");

-- CreateIndex
CREATE INDEX "_UserToRole_B_index" ON "_UserToRole"("B");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_booking_contact_id_fkey" FOREIGN KEY ("booking_contact_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "event_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_client_org_id_fkey" FOREIGN KEY ("client_org_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_client_contact_id_fkey" FOREIGN KEY ("client_contact_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_billing_contact_id_fkey" FOREIGN KEY ("billing_contact_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_point" ADD CONSTRAINT "contact_point_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_point" ADD CONSTRAINT "contact_point_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_product" ADD CONSTRAINT "event_product_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_product" ADD CONSTRAINT "event_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTask" ADD CONSTRAINT "_ProductToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTask" ADD CONSTRAINT "_ProductToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskToUser" ADD CONSTRAINT "_TaskToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskToUser" ADD CONSTRAINT "_TaskToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventTasks" ADD CONSTRAINT "_EventTasks_A_fkey" FOREIGN KEY ("A") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventTasks" ADD CONSTRAINT "_EventTasks_B_fkey" FOREIGN KEY ("B") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventContacts" ADD CONSTRAINT "_EventContacts_A_fkey" FOREIGN KEY ("A") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventContacts" ADD CONSTRAINT "_EventContacts_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToTask" ADD CONSTRAINT "_OrganizationToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToTask" ADD CONSTRAINT "_OrganizationToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToContactPoint" ADD CONSTRAINT "_ProductToContactPoint_A_fkey" FOREIGN KEY ("A") REFERENCES "contact_point"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToContactPoint" ADD CONSTRAINT "_ProductToContactPoint_B_fkey" FOREIGN KEY ("B") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToRole" ADD CONSTRAINT "_UserToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToRole" ADD CONSTRAINT "_UserToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
