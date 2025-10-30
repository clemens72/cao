// seed.ts

import { PrismaClient, OrgType, ProductCategory } from '../src/generated/prisma'

const prisma = new PrismaClient();

async function main() {
  // 1. Create Agents
  const agent1 = await prisma.agent.create({
    data: { username: "admin1", fname: "Paul", lname: "Hoy" },
  });

  const agent2 = await prisma.agent.create({
    data: { username: "admin2", fname: "Tammy", lname: "Walkup" },
  });

  const agent3 = await prisma.agent.create({
    data: { username: "agent3", fname: "Joshua", lname: "Burch", active: false },
  });

  const agent4 = await prisma.agent.create({
    data: { username: "agent4", fname: "Eric", lname: "Clemens" },
  });

  console.log(`Created agents: ${agent1.username}, ${agent2.username}, ${agent3.username}, ${agent4.username}`);

  // --- 2. Create Contacts
  const contact1 = await prisma.contact.create({
    data: { email: "jane.doe@example.com", fname: "Jane", lname: "Doe", phone: "555-1234", address: "123 Main St, Anytown, USA", agentId: agent1.id },
  });

  const contact2 = await prisma.contact.create({
    data: { email: "john.smith@example.com", fname: "John", lname: "Smith", phone: "555-5678", address: "456 Oak Ave, Otherville, USA", agentId: agent2.id },
  });

  const contact3 = await prisma.contact.create({
    data: { email: "sara.connor@example.com", fname: "Sara", lname: "Connor", phone: "555-9012", address: "789 Tech Rd, Cyber City", agentId: agent1.id },
  });

  const contact4 = await prisma.contact.create({
    data: { email: "mike.ross@example.com", fname: "Mike", lname: "Ross", phone: "555-3456", address: "101 Legal Pkwy, The Firm", agentId: agent4.id },
  });

  const contact5 = await prisma.contact.create({
    data: { email: "linda.jones@example.com", fname: "Linda", lname: "Jones", phone: "555-7890", address: "202 Retail Plaza, Shopville", agentId: agent2.id },
  });

  console.log(`Created contacts: ${contact1.fname}, ${contact2.fname}, ${contact3.fname}, ${contact4.fname}, ${contact5.fname}`);

  // --- 3. Create Organizations
  const organization1 = await prisma.organization.create({
    data: { name: "Acme Event Planners", address: "789 Pine Ln, City A", note: "Client for large annual gala.", type: OrgType.AGENCY, referral: "Referred by Contact 1", contactId: contact1.id, agentId: agent1.id },
  });

  const organization2 = await prisma.organization.create({
    data: { name: "Grand City Hotel", address: "100 Grand Blvd, Downtown", note: "Potential venue for multiple events.", type: OrgType.HOTEL, referral: "Cold call", contactId: contact2.id, agentId: agent2.id },
  });

  const organization3 = await prisma.organization.create({
    data: { name: "The Blue Note Club", address: "33 Music Row, Entertainment District", note: "Looking for regular music acts.", type: OrgType.BAR, referral: "Online search", contactId: contact3.id, agentId: agent1.id },
  });

  const organization4 = await prisma.organization.create({
    data: { name: "Global Tech Solutions", address: "99 Silicon Valley, CA", note: "Large tech business, interested in corporate training.", type: OrgType.BUSINESS, referral: "Agent 4 networking event", contactId: contact4.id, agentId: agent4.id },
  });

  console.log(`Created organizations: ${organization1.name}, ${organization2.name}, ${organization3.name}, ${organization4.name}`);

  // --- 4. Create Products
  const product1 = await prisma.product.create({
    data: { name: "Custom Website Design", description: "Full service website design and deployment.", category: ProductCategory.SERVICE, contactId: contact1.id, agentId: agent1.id },
  });

  const product2 = await prisma.product.create({
    data: { name: "Audio Production Package", description: "Equipment and technician for live music.", category: ProductCategory.PRODUCTION, contactId: contact2.id, agentId: agent2.id },
  });

  const product3 = await prisma.product.create({
    data: { name: "Jazz Trio Performance", description: "Three-piece jazz band for background music.", category: ProductCategory.ENTERTAINER_MUSIC, contactId: contact3.id, agentId: agent1.id },
  });

  const product4 = await prisma.product.create({
    data: { name: "Corporate Training Module", description: "Leadership and team-building course.", category: ProductCategory.SERVICE, contactId: contact4.id, agentId: agent4.id },
  });

  const product5 = await prisma.product.create({
    data: { name: "Event T-Shirts (Merch)", description: "Custom printed cotton t-shirts for event staff.", category: ProductCategory.MERCHANDISE, contactId: contact5.id, agentId: agent2.id },
  });

  console.log(`Created products: ${product1.name}, ${product2.name}, ${product3.name}, ${product4.name}, ${product5.name}`);

  // --- 5. Create Events
  const event1 = await prisma.event.create({
    data: {
      name: "Annual Company Gala",
      gross_price: 15000.00,
      note: "Major networking event with 500+ attendees.",
      startDate: new Date("2026-03-15T18:00:00Z"),
      endDate: new Date("2026-03-15T23:00:00Z"),
      contactId: contact1.id,
      agentId: agent1.id,
      organizations: { connect: [{ id: organization1.id }] },
      products: { connect: [{ id: product1.id }] },
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: "Summer Music Showcase",
      gross_price: 5500.00,
      note: "A series of small live music performances.",
      startDate: new Date("2025-07-20T19:30:00Z"),
      endDate: new Date("2025-07-20T23:30:00Z"),
      contactId: contact3.id,
      agentId: agent1.id,
      organizations: { connect: [{ id: organization3.id }] },
      products: { connect: [{ id: product3.id }] },
    },
  });

  const event3 = await prisma.event.create({
    data: {
      name: "Q3 Leadership Seminar",
      gross_price: 8000.00,
      note: "Full-day training for executive staff.",
      startDate: new Date("2025-11-01T09:00:00Z"),
      endDate: new Date("2025-11-01T17:00:00Z"),
      contactId: contact4.id,
      agentId: agent4.id,
      organizations: { connect: [{ id: organization4.id }, { id: organization2.id }] },
      products: { connect: [{ id: product4.id }] },
    },
  });

  const event4 = await prisma.event.create({
    data: {
      name: "Holiday Party (Internal)",
      gross_price: 3000.00,
      note: "Small gathering for internal team and families.",
      startDate: new Date("2025-12-12T17:00:00Z"),
      endDate: new Date("2025-12-12T22:00:00Z"),
      contactId: contact2.id,
      agentId: agent2.id,
    },
  });

  // --- Add 10 additional events (2 per week starting this week)
  function getNextMonday(date: Date) {
    const day = date.getDay();
    const diff = (day === 0 ? 1 : 8 - day);
    const nextMonday = new Date(date);
    nextMonday.setDate(date.getDate() + diff);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
  }

  const nearestMonday = getNextMonday(new Date());

  for (let i = 0; i < 10; i++) {
    const weekOffset = Math.floor(i / 2);
    const isFirstEventOfWeek = i % 2 === 0;

    const startDate = new Date(nearestMonday.getTime() + weekOffset * 7 * 24 * 60 * 60 * 1000);
    if (isFirstEventOfWeek) startDate.setHours(10, 0, 0, 0);
    else startDate.setHours(15, 0, 0, 0);

    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);

    await prisma.event.create({
      data: {
        name: `Seed Event ${i + 1}`,
        gross_price: 2000 + i * 500,
        note: `Automatically generated event ${i + 1}`,
        startDate,
        endDate,
        contactId: [contact1.id, contact2.id, contact3.id, contact4.id, contact5.id][i % 5],
        agentId: [agent1.id, agent2.id, agent3.id, agent4.id][i % 4],
        organizations: {
          connect: [
            { id: [organization1.id, organization2.id, organization3.id, organization4.id][i % 4] },
          ],
        },
        products: {
          connect: [
            { id: [product1.id, product2.id, product3.id, product4.id, product5.id][i % 5] },
          ],
        },
      },
    });
  }

  console.log("Added 10 additional events (2 per week starting this week on Monday)");

  // --- 6. Create Tasks
  const task1 = await prisma.task.create({ data: { note: "Follow up with Jane Doe regarding contract signing.", complete: false, agentId: agent1.id } });
  const task2 = await prisma.task.create({ data: { note: "Review John Smith's product requirements.", complete: true, closed: new Date(), agentId: agent2.id } });
  const task3 = await prisma.task.create({ data: { note: "Draft proposal for The Blue Note Club.", complete: false, agentId: agent1.id } });
  const task4 = await prisma.task.create({ data: { note: "Send thank-you email to Sara Connor for referral.", complete: true, closed: new Date("2025-05-10T10:00:00Z"), agentId: agent2.id } });
  const task5 = await prisma.task.create({ data: { note: "Initial call with Global Tech Solutions' HR department.", complete: false, agentId: agent4.id } });

  console.log(`Created tasks: ${task1.note}, ${task2.note}, ${task3.note}, ${task4.note}, ${task5.note}`);

  // --- 7. Create Reports
  const report1 = await prisma.report.create({ data: { name: "Q4 Sales Overview" } });
  const report2 = await prisma.report.create({ data: { name: "Agent Performance - May 2025" } });
  const report3 = await prisma.report.create({ data: { name: "Top Contact Referrals YTD" } });
  const report4 = await prisma.report.create({ data: { name: "Event Summary - 2024" } });

  console.log(`Created reports: ${report1.name}, ${report2.name}, ${report3.name}, ${report4.name}`);
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) });
