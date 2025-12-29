-- CreateEnum
CREATE TYPE "EventForm" AS ENUM ('YES', 'NO', 'N_A');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('GENERAL', 'EVENT');

-- CreateTable
CREATE TABLE "address" (
    "id" VARCHAR(36) NOT NULL,
    "address1" VARCHAR(255),
    "address2" VARCHAR(255),
    "city" VARCHAR(255),
    "state_id" VARCHAR(36),
    "zip" VARCHAR(20),
    "zip_extension" VARCHAR(10),
    "entity_id" VARCHAR(36),
    "country_id" VARCHAR(36),

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientProductPitch" (
    "id" VARCHAR(36) NOT NULL,
    "person_entity_id" VARCHAR(36) NOT NULL,
    "product_entity_id" VARCHAR(36) NOT NULL,
    "pitch_date" TIMESTAMP(3),
    "pitch_price" TEXT,
    "note" TEXT,
    "organization_entity_id" VARCHAR(36),
    "pitched_by_entity_id" VARCHAR(36),

    CONSTRAINT "ClientProductPitch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" VARCHAR(36) NOT NULL,
    "code" VARCHAR(4) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentStore" (
    "id" VARCHAR(36) NOT NULL,
    "document_name" VARCHAR(255) NOT NULL,
    "document_type" VARCHAR(100) NOT NULL,
    "entity_id" VARCHAR(36) NOT NULL,
    "size" TEXT,
    "created_by_person_entity_id" VARCHAR(36) NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL,
    "modified_by_person_entity_id" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,

    CONSTRAINT "DocumentStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentType" (
    "id" VARCHAR(36) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,

    CONSTRAINT "DocumentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DynamicList" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1000),

    CONSTRAINT "DynamicList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DynamicListMember" (
    "id" VARCHAR(36) NOT NULL,
    "organization_entity_id" VARCHAR(36),
    "person_entity_id" VARCHAR(36),
    "dynamic_list_id" VARCHAR(36),

    CONSTRAINT "DynamicListMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectronicAddress" (
    "id" VARCHAR(36) NOT NULL,
    "electronicAddress" VARCHAR(255) NOT NULL,
    "electronic_address_type_id" VARCHAR(36) NOT NULL,
    "entity_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "ElectronicAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectronicAddressType" (
    "id" VARCHAR(36) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "ElectronicAddressType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entertainer" (
    "product_entity_id" VARCHAR(36) NOT NULL,
    "leader_person_entity_id" VARCHAR(36),
    "band_size" TEXT,
    "special_requirements" TEXT,
    "agent_person_entity_id" VARCHAR(36),
    "bio" TEXT,
    "is_exclusive" BOOLEAN,
    "is_active" BOOLEAN,
    "date_business_cards_sent" TIMESTAMP(3),
    "num_business_cards_sent" TEXT,

    CONSTRAINT "Entertainer_pkey" PRIMARY KEY ("product_entity_id")
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" VARCHAR(36) NOT NULL,
    "entity_type_id" VARCHAR(36) NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityType" (
    "id" VARCHAR(36) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "EntityType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "entityId" VARCHAR(36) NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "name" VARCHAR(255) NOT NULL,
    "agent_person_entity_id" VARCHAR(36),
    "event_type_id" VARCHAR(36),
    "contract_sent_date" TIMESTAMP(3),
    "contract_returned_date" TIMESTAMP(3),
    "budget" TEXT,
    "note" TEXT,
    "event_status_id" VARCHAR(36),
    "attendance" TEXT,
    "event_form" "EventForm",
    "location" VARCHAR(255),
    "client_organization_entity_id" VARCHAR(36),
    "client_person_entity_id" VARCHAR(36),
    "guest_arrival_time" TEXT,
    "reportTo" VARCHAR(255),
    "break_area" VARCHAR(255),
    "equipment_storage" VARCHAR(255),
    "venue_organization_entity_id" VARCHAR(36),
    "venue_person_entity_id" VARCHAR(36),
    "billing_contact_organization_entity_id" VARCHAR(36),
    "billing_contact_person_entity_id" VARCHAR(36),
    "start_time" TEXT,
    "end_time" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "EventPerson" (
    "id" VARCHAR(36) NOT NULL,
    "event_entity_id" VARCHAR(36) NOT NULL,
    "person_entity_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "EventPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventProduct" (
    "id" VARCHAR(36) NOT NULL,
    "product_entity_id" VARCHAR(36) NOT NULL,
    "event_entity_id" VARCHAR(36) NOT NULL,
    "venue_organization_entity_id" VARCHAR(36),
    "venue_organization_resource_id" VARCHAR(36),
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "gross_price" TEXT,
    "fee_percent" TEXT,
    "contract_sent_date" TIMESTAMP(3),
    "contract_returned_date" TIMESTAMP(3),
    "special_instructions" TEXT,
    "setup_by" TEXT,
    "client_provides" TEXT,
    "product_status_id" VARCHAR(36) NOT NULL,
    "note" TEXT,
    "created_by_person_entity_id" VARCHAR(36),
    "created_date" TIMESTAMP(3),
    "modified_by_person_entity_id" VARCHAR(36),
    "modified_date" TIMESTAMP(3),
    "band_size" TEXT,
    "contracted_to_provide" TEXT,
    "deposit" TEXT,
    "payment_terms" TEXT,
    "attire" TEXT,
    "location" VARCHAR(255),
    "venue_person_entity_id" VARCHAR(36),

    CONSTRAINT "EventProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventStatus" (
    "id" VARCHAR(36) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "EventStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventType" (
    "id" VARCHAR(36) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "entityId" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "note" TEXT,
    "agent_person_entity_id" VARCHAR(36),
    "referred_by" VARCHAR(255),

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "OrganizationPerson" (
    "organization_entity_id" VARCHAR(36) NOT NULL,
    "person_entity_id" VARCHAR(36) NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "expiration_date" TIMESTAMP(3),
    "is_primary" BOOLEAN NOT NULL,
    "id" VARCHAR(36) NOT NULL,
    "note" TEXT,

    CONSTRAINT "OrganizationPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationResource" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "organization_entity_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "OrganizationResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationType" (
    "id" VARCHAR(36) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "OrganizationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationTypes" (
    "id" VARCHAR(36) NOT NULL,
    "organization_entity_id" VARCHAR(36) NOT NULL,
    "organization_type_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "OrganizationTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" VARCHAR(36) NOT NULL,
    "from_entity_id" VARCHAR(36) NOT NULL,
    "to_entity_id" VARCHAR(36) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "amount" TEXT,
    "payment_type_id" VARCHAR(36) NOT NULL,
    "event_entity_id" VARCHAR(36) NOT NULL,
    "reference_number" VARCHAR(100),
    "created_by_person_entity_id" VARCHAR(36) NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL,
    "modified_by_person_entity_id" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "cae_fee" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentType" (
    "id" VARCHAR(36) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "PaymentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "entityId" VARCHAR(36) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "title_id" VARCHAR(36),
    "note" TEXT,
    "agent_person_entity_id" VARCHAR(36),
    "referred_by" VARCHAR(255),
    "job_title" VARCHAR(100),
    "role_id" VARCHAR(36),

    CONSTRAINT "Person_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "Phone" (
    "id" VARCHAR(36) NOT NULL,
    "phone_number" VARCHAR(50) NOT NULL,
    "phone_type_id" VARCHAR(36) NOT NULL,
    "entity_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneType" (
    "id" VARCHAR(36) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "PhoneType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "entityId" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "product_type_id" VARCHAR(36) NOT NULL,
    "gross_price" TEXT,
    "fee_percent" TEXT,
    "booking_contact_person_entity_id" VARCHAR(36),
    "note" TEXT,
    "available" BOOLEAN NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "entityId" VARCHAR(36) NOT NULL,
    "product_type_category_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "ProductStatus" (
    "id" VARCHAR(36) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "sort_priority" TEXT,

    CONSTRAINT "ProductStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductType" (
    "id" VARCHAR(36) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "ProductType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTypeCategory" (
    "id" VARCHAR(36) NOT NULL,
    "product_type_id" VARCHAR(36) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "sort_priority" TEXT,

    CONSTRAINT "ProductTypeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" VARCHAR(36) NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "report_type" "ReportType" NOT NULL,
    "query" TEXT NOT NULL,
    "report_template_id" VARCHAR(36) NOT NULL,
    "visible" BOOLEAN NOT NULL,
    "created_by_person_entity_id" VARCHAR(36) NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL,
    "modified_by_person_entity_id" VARCHAR(36) NOT NULL,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "parameter_page_override" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportTemplate" (
    "document_store_id" VARCHAR(36) NOT NULL,
    "report_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "ReportTemplate_pkey" PRIMARY KEY ("document_store_id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" VARCHAR(36) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "State" (
    "id" VARCHAR(36) NOT NULL,
    "code" VARCHAR(4) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" VARCHAR(36) NOT NULL,
    "task_date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "entity_id" VARCHAR(36) NOT NULL,
    "created_by_person_entity_id" VARCHAR(36) NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL,
    "modified_by_person_entity_id" VARCHAR(36),
    "modified_date" TIMESTAMP(3),
    "completed" BOOLEAN,
    "owner_person_entity_id" VARCHAR(36),

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Title" (
    "id" VARCHAR(36) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "Title_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "person_entity_id" VARCHAR(36) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "role_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("person_entity_id")
);

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProductPitch" ADD CONSTRAINT "ClientProductPitch_person_entity_id_fkey" FOREIGN KEY ("person_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProductPitch" ADD CONSTRAINT "ClientProductPitch_product_entity_id_fkey" FOREIGN KEY ("product_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProductPitch" ADD CONSTRAINT "ClientProductPitch_organization_entity_id_fkey" FOREIGN KEY ("organization_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProductPitch" ADD CONSTRAINT "ClientProductPitch_pitched_by_entity_id_fkey" FOREIGN KEY ("pitched_by_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentStore" ADD CONSTRAINT "DocumentStore_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentStore" ADD CONSTRAINT "DocumentStore_created_by_person_entity_id_fkey" FOREIGN KEY ("created_by_person_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentStore" ADD CONSTRAINT "DocumentStore_modified_by_person_entity_id_fkey" FOREIGN KEY ("modified_by_person_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DynamicListMember" ADD CONSTRAINT "DynamicListMember_organization_entity_id_fkey" FOREIGN KEY ("organization_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DynamicListMember" ADD CONSTRAINT "DynamicListMember_person_entity_id_fkey" FOREIGN KEY ("person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DynamicListMember" ADD CONSTRAINT "DynamicListMember_dynamic_list_id_fkey" FOREIGN KEY ("dynamic_list_id") REFERENCES "DynamicList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectronicAddress" ADD CONSTRAINT "ElectronicAddress_electronic_address_type_id_fkey" FOREIGN KEY ("electronic_address_type_id") REFERENCES "ElectronicAddressType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectronicAddress" ADD CONSTRAINT "ElectronicAddress_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entertainer" ADD CONSTRAINT "Entertainer_product_entity_id_fkey" FOREIGN KEY ("product_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entertainer" ADD CONSTRAINT "Entertainer_leader_person_entity_id_fkey" FOREIGN KEY ("leader_person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entertainer" ADD CONSTRAINT "Entertainer_agent_person_entity_id_fkey" FOREIGN KEY ("agent_person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "EntityType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_agent_person_entity_id_fkey" FOREIGN KEY ("agent_person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "EventType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_event_status_id_fkey" FOREIGN KEY ("event_status_id") REFERENCES "EventStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_client_organization_entity_id_fkey" FOREIGN KEY ("client_organization_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_client_person_entity_id_fkey" FOREIGN KEY ("client_person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_venue_organization_entity_id_fkey" FOREIGN KEY ("venue_organization_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_venue_person_entity_id_fkey" FOREIGN KEY ("venue_person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_billing_contact_organization_entity_id_fkey" FOREIGN KEY ("billing_contact_organization_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_billing_contact_person_entity_id_fkey" FOREIGN KEY ("billing_contact_person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPerson" ADD CONSTRAINT "EventPerson_event_entity_id_fkey" FOREIGN KEY ("event_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPerson" ADD CONSTRAINT "EventPerson_person_entity_id_fkey" FOREIGN KEY ("person_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProduct" ADD CONSTRAINT "EventProduct_product_entity_id_fkey" FOREIGN KEY ("product_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProduct" ADD CONSTRAINT "EventProduct_event_entity_id_fkey" FOREIGN KEY ("event_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProduct" ADD CONSTRAINT "EventProduct_venue_organization_entity_id_fkey" FOREIGN KEY ("venue_organization_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProduct" ADD CONSTRAINT "EventProduct_venue_organization_resource_id_fkey" FOREIGN KEY ("venue_organization_resource_id") REFERENCES "OrganizationResource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProduct" ADD CONSTRAINT "EventProduct_product_status_id_fkey" FOREIGN KEY ("product_status_id") REFERENCES "ProductStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProduct" ADD CONSTRAINT "EventProduct_created_by_person_entity_id_fkey" FOREIGN KEY ("created_by_person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProduct" ADD CONSTRAINT "EventProduct_modified_by_person_entity_id_fkey" FOREIGN KEY ("modified_by_person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProduct" ADD CONSTRAINT "EventProduct_venue_person_entity_id_fkey" FOREIGN KEY ("venue_person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_agent_person_entity_id_fkey" FOREIGN KEY ("agent_person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationPerson" ADD CONSTRAINT "OrganizationPerson_organization_entity_id_fkey" FOREIGN KEY ("organization_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationPerson" ADD CONSTRAINT "OrganizationPerson_person_entity_id_fkey" FOREIGN KEY ("person_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationResource" ADD CONSTRAINT "OrganizationResource_organization_entity_id_fkey" FOREIGN KEY ("organization_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationTypes" ADD CONSTRAINT "OrganizationTypes_organization_entity_id_fkey" FOREIGN KEY ("organization_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationTypes" ADD CONSTRAINT "OrganizationTypes_organization_type_id_fkey" FOREIGN KEY ("organization_type_id") REFERENCES "OrganizationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_from_entity_id_fkey" FOREIGN KEY ("from_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_to_entity_id_fkey" FOREIGN KEY ("to_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payment_type_id_fkey" FOREIGN KEY ("payment_type_id") REFERENCES "PaymentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_event_entity_id_fkey" FOREIGN KEY ("event_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_created_by_person_entity_id_fkey" FOREIGN KEY ("created_by_person_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_modified_by_person_entity_id_fkey" FOREIGN KEY ("modified_by_person_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_title_id_fkey" FOREIGN KEY ("title_id") REFERENCES "Title"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_agent_person_entity_id_fkey" FOREIGN KEY ("agent_person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_phone_type_id_fkey" FOREIGN KEY ("phone_type_id") REFERENCES "PhoneType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_product_type_id_fkey" FOREIGN KEY ("product_type_id") REFERENCES "ProductType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_booking_contact_person_entity_id_fkey" FOREIGN KEY ("booking_contact_person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_product_type_category_id_fkey" FOREIGN KEY ("product_type_category_id") REFERENCES "ProductTypeCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTypeCategory" ADD CONSTRAINT "ProductTypeCategory_product_type_id_fkey" FOREIGN KEY ("product_type_id") REFERENCES "ProductType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_created_by_person_entity_id_fkey" FOREIGN KEY ("created_by_person_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_modified_by_person_entity_id_fkey" FOREIGN KEY ("modified_by_person_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportTemplate" ADD CONSTRAINT "ReportTemplate_document_store_id_fkey" FOREIGN KEY ("document_store_id") REFERENCES "DocumentStore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportTemplate" ADD CONSTRAINT "ReportTemplate_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_created_by_person_entity_id_fkey" FOREIGN KEY ("created_by_person_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_modified_by_person_entity_id_fkey" FOREIGN KEY ("modified_by_person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_owner_person_entity_id_fkey" FOREIGN KEY ("owner_person_entity_id") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_person_entity_id_fkey" FOREIGN KEY ("person_entity_id") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
