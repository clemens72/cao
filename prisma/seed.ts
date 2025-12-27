import { PrismaClient } from '../src/generated/prisma';
import fs from 'node:fs';
import path from 'node:path';
import Papa from 'papaparse';
import { v5 as uuidv5 } from 'uuid'; // You must run: npm install uuid
import { parse, isValid } from 'date-fns'

const prisma = new PrismaClient();

// Use a fixed namespace so the same numeric ID always produces the same UUID
const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

function toUUID(val: any) {
    if (!val || String(val).trim() === "") return null;
    const str = String(val).trim();
    // If it's already a UUID, don't double-convert it
    return str.length === 36 ? str : uuidv5(str, NAMESPACE);
}

function parseCSVDate(dateStr: string) {
    if (!dateStr || dateStr.trim() === "") return null;
    const trimmed = dateStr.trim();

    // Try format 1: "14-Nov-2000 00:00:00" (Full)
    let parsedDate = parse(trimmed, 'd-MMM-yyyy HH:mm:ss', new Date());

    // Fallback to format 2: "14-Nov-2000" (Short)
    if (!isValid(parsedDate)) {
        parsedDate = parse(trimmed, 'd-MMM-yyyy', new Date());
    }

    return isValid(parsedDate) ? parsedDate : null;
}

function mapEventForm(val: any): string {
    const cleanVal = String(val).trim();

    if (cleanVal === "1") return "YES";
    if (cleanVal === "0") return "NO";

    // Default for blanks or other values
    return "N_A";
}

async function seedFromCSV(tableName: string, filePath: string) {
    const csvFile = fs.readFileSync(filePath, 'utf8');
    const { data } = Papa.parse(csvFile, {
        header: true,
        dynamicTyping: false, // Keep as strings to ensure IDs aren't corrupted
        skipEmptyLines: true,
    });

    // --- THIS IS WHERE YOU CALL THE FUNCTION ---
    const processedData = data.map((row: any) => {
        const newRow = { ...row };

        if (newRow.hasOwnProperty('eventForm')) {
            newRow.eventForm = mapEventForm(newRow.eventForm);
        }

        // 1. Convert Primary Key
        if (newRow.id) newRow.id = toUUID(newRow.id);

        // 2. Convert Foreign Keys found in your schema
        if (newRow.stateId) newRow.stateId = toUUID(newRow.stateId);
        if (newRow.entityId) newRow.entityId = toUUID(newRow.entityId);
        if (newRow.countryId) newRow.countryId = toUUID(newRow.countryId);
        if (newRow.entityTypeId) newRow.entityTypeId = toUUID(newRow.entityTypeId);
        if (newRow.personEntityId) newRow.personEntityId = toUUID(newRow.personEntityId);
        if (newRow.createdByPersonEntityId) newRow.createdByPersonEntityId = toUUID(newRow.createdByPersonEntityId);
        if (newRow.modifiedByPersonEntityId) newRow.modifiedByPersonEntityId = toUUID(newRow.modifiedByPersonEntityId);
        if (newRow.productTypeId) newRow.productTypeId = toUUID(newRow.productTypeId);
        if (newRow.productStatusId) newRow.productStatusId = toUUID(newRow.productStatusId);
        if (newRow.bookingContactPersonEntityId) newRow.bookingContactPersonEntityId = toUUID(newRow.bookingContactPersonEntityId);
        if (newRow.roleId) newRow.roleId = toUUID(newRow.roleId);
        if (newRow.ownerPersonEntityId) newRow.ownerPersonEntityId = toUUID(newRow.ownerPersonEntityId);
        if (newRow.eventEntityId) newRow.eventEntityId = toUUID(newRow.eventEntityId);
        if (newRow.toEntityId) newRow.toEntityId = toUUID(newRow.toEntityId);
        if (newRow.paymentTypeId) newRow.paymentTypeId = toUUID(newRow.paymentTypeId);
        if (newRow.eventProductId) newRow.eventProductId = toUUID(newRow.eventProductId);
        if (newRow.taskEntityId) newRow.taskEntityId = toUUID(newRow.taskEntityId);
        if (newRow.assignedToPersonEntityId) newRow.assignedToPersonEntityId = toUUID(newRow.assignedToPersonEntityId);
        if (newRow.contactPersonEntityId) newRow.contactPersonEntityId = toUUID(newRow.contactPersonEntityId);
        if (newRow.organizationEntityId) newRow.organizationEntityId = toUUID(newRow.organizationEntityId);
        if (newRow.eventEntityId) newRow.eventEntityId = toUUID(newRow.eventEntityId);
        if (newRow.productEntityId) newRow.productEntityId = toUUID(newRow.productEntityId);
        if (newRow.titleId) newRow.titleId = toUUID(newRow.titleId);
        if (newRow.paymentId) newRow.paymentId = toUUID(newRow.paymentId);
        if (newRow.entityCategoryId) newRow.entityCategoryId = toUUID(newRow.entityCategoryId);
        if (newRow.createdByPersonEntityId) newRow.createdByPersonEntityId = toUUID(newRow.createdByPersonEntityId);
        if (newRow.modifiedByPersonEntityId) newRow.modifiedByPersonEntityId = toUUID(newRow.modifiedByPersonEntityId);
        if (newRow.assignedToPersonEntityId) newRow.assignedToPersonEntityId = toUUID(newRow.assignedToPersonEntityId);
        if (newRow.ownerPersonEntityId) newRow.ownerPersonEntityId = toUUID(newRow.ownerPersonEntityId);
        if (newRow.taskEntityId) newRow.taskEntityId = toUUID(newRow.taskEntityId);
        if (newRow.agentPersonEntityId) newRow.agentPersonEntityId = toUUID(newRow.agentPersonEntityId);
        if (newRow.phoneTypeId) newRow.phoneTypeId = toUUID(newRow.phoneTypeId);
        if (newRow.organizationTypeId) newRow.organizationTypeId = toUUID(newRow.organizationTypeId);
        if (newRow.electronicAddressTypeId) newRow.electronicAddressTypeId = toUUID(newRow.electronicAddressTypeId);
        if (newRow.clientOrganizationEntityId) newRow.clientOrganizationEntityId = toUUID(newRow.clientOrganizationEntityId);
        if (newRow.clientPersonEntityId) newRow.clientPersonEntityId = toUUID(newRow.clientPersonEntityId);
        if (newRow.billingContactOrganizationEntityId) newRow.billingContactOrganizationEntityId = toUUID(newRow.billingContactOrganizationEntityId);
        if (newRow.billingContactPersonEntityId) newRow.billingContactPersonEntityId = toUUID(newRow.billingContactPersonEntityId);
        if (newRow.eventStatusId) newRow.eventStatusId = toUUID(newRow.eventStatusId);
        if (newRow.venueOrganizationEntityId) newRow.venueOrganizationEntityId = toUUID(newRow.venueOrganizationEntityId);
        if (newRow.eventTypeId) newRow.eventTypeId = toUUID(newRow.eventTypeId);
        if (newRow.venuePersonEntityId) newRow.venuePersonEntityId = toUUID(newRow.venuePersonEntityId);
        if (newRow.productTypeCategoryId) newRow.productTypeCategoryId = toUUID(newRow.productTypeCategoryId);
        if (newRow.venueOrganizationResourceId) newRow.venueOrganizationResourceId = toUUID(newRow.venueOrganizationResourceId);
        if (newRow.pitchedByEntityId) newRow.pitchedByEntityId = toUUID(newRow.pitchedByEntityId);
        if (newRow.leaderPersonEntityId) newRow.leaderPersonEntityId = toUUID(newRow.leaderPersonEntityId);

        // 2. Date Conversions (using our previous date-fns logic)
        Object.keys(newRow).forEach(key => {
            if (key.toLowerCase().includes('date') && typeof newRow[key] === 'string') {
                newRow[key] = parseCSVDate(newRow[key]);
            }
        });

        // 3. BOOLEAN CONVERSION
        // This converts "true"/"false" strings into actual boolean types
        Object.keys(newRow).forEach(key => {
            const val = String(newRow[key]).toLowerCase().trim();
            if (val === 'true') {
                newRow[key] = true;
            } else if (val === 'false') {
                newRow[key] = false;
            }
        });

        // 3. Clean up nulls for optional fields
        Object.keys(newRow).forEach(key => {
            if (newRow[key] === "" || newRow[key] === undefined) newRow[key] = null;
        });

        return newRow;
    });

    console.log(`Seeding ${processedData.length} records into ${tableName}...`);



    /*     try {
            await (prisma as any)[tableName].createMany({
                data: processedData,
                skipDuplicates: true,
            });
        } catch (error: any) {
            console.error(`❌ Error in ${tableName}:`, error.message);
        }
    } */

    // --- NEW BATCHING LOGIC ---
    const batchSize = 90; // Small enough to stay under Postgres parameter limits
    for (let i = 0; i < processedData.length; i += batchSize) {
        const batch = processedData.slice(i, i + batchSize);
        try {
            await (prisma as any)[tableName].createMany({
                data: batch,
                skipDuplicates: true,
            });
            console.log(`  Inserted batch ${i / batchSize + 1} for ${tableName}`);
        } catch (error: any) {
            console.error(`❌ Error in ${tableName} batch starting at ${i}:`, error.message);
            throw error; // Stop if a batch fails
        }
    }
}

async function main() {
    const seedsDir = path.join(__dirname, 'seeds');
    // Sorting ensures 01-EntityType seeds before 02-Entity, etc.
    const files = fs.readdirSync(seedsDir).filter(f => f.endsWith('.csv')).sort();

    for (const file of files) {
        const tableName = file.replace('.csv', '').replace(/^\d+-/, '');
        await seedFromCSV(tableName, path.join(seedsDir, file));
    }
}

main().finally(async () => await prisma.$disconnect());