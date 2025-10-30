// seed.ts

import { PrismaClient, OrgType, ProductCategory } from '../src/generated/prisma'

const prisma = new PrismaClient();

async function main() {
  // 1. Create Agents
  const agent1 = await prisma.agent.create({
    data: {
      username: "admin1",
      fname: "Paul",
      lname: "Hoy"
    },
  });

  const agent2 = await prisma.agent.create({
    data: {
      username: "admin2",
      fname: "Tammy",
      lname: "Walkup"
    },
  });
  
  const agent3 = await prisma.agent.create({
    data: {
      username: "agent3",
      fname: "Joshua",
      lname: "Burch",
      active: false,
    },
  });
  
  const agent4 = await prisma.agent.create({
    data: {
      username: "agent4",
      fname: "Eric",
      lname: "Clemens",
    },
  });

  console.log(`Created agents: ${agent1.username}, ${agent2.username}, ${agent3.username}, ${agent4.username}`);

  // ---

  // 2. Create Contacts
  const contact1 = await prisma.contact.create({
    data: {
      email: "jane.doe@example.com",
      fname: "Jane",
      lname: "Doe",
      phone: "555-1234",
      address: "123 Main St, Anytown, USA",
      agentId: agent1.id, // Related to agent1
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      email: "john.smith@example.com",
      fname: "John",
      lname: "Smith",
      phone: "555-5678",
      address: "456 Oak Ave, Otherville, USA",
      agentId: agent2.id, // Related to agent2
    },
  });
  
  const contact3 = await prisma.contact.create({
    data: {
      email: "sara.connor@example.com",
      fname: "Sara",
      lname: "Connor",
      phone: "555-9012",
      address: "789 Tech Rd, Cyber City",
      agentId: agent1.id, // Related to agent1
    },
  });

  const contact4 = await prisma.contact.create({
    data: {
      email: "mike.ross@example.com",
      fname: "Mike",
      lname: "Ross",
      phone: "555-3456",
      address: "101 Legal Pkwy, The Firm",
      agentId: agent4.id, // Related to agent4
    },
  });

  const contact5 = await prisma.contact.create({
    data: {
      email: "linda.jones@example.com",
      fname: "Linda",
      lname: "Jones",
      phone: "555-7890",
      address: "202 Retail Plaza, Shopville",
      agentId: agent2.id, // Related to agent2
    },
  });

  console.log(`Created contacts: ${contact1.fname}, ${contact2.fname}, ${contact3.fname}, ${contact4.fname}, ${contact5.fname}`);

  // ---

  // 3. Create Organizations
  const organization1 = await prisma.organization.create({
    data: {
      name: "Acme Event Planners",
      address: "789 Pine Ln, City A",
      note: "Client for large annual gala.",
      type: OrgType.AGENCY, // Using the OrgType enum
      referral: "Referred by Contact 1",
      contactId: contact1.id, // Primary contact is contact1
      agentId: agent1.id, // Related to agent1
    },
  });
  
  const organization2 = await prisma.organization.create({
    data: {
      name: "Grand City Hotel",
      address: "100 Grand Blvd, Downtown",
      note: "Potential venue for multiple events.",
      type: OrgType.HOTEL,
      referral: "Cold call",
      contactId: contact2.id, // Primary contact is contact2
      agentId: agent2.id, // Related to agent2
    },
  });

  const organization3 = await prisma.organization.create({
    data: {
      name: "The Blue Note Club",
      address: "33 Music Row, Entertainment District",
      note: "Looking for regular music acts.",
      type: OrgType.BAR,
      referral: "Online search",
      contactId: contact3.id, // Primary contact is contact3
      agentId: agent1.id, // Related to agent1
    },
  });

  const organization4 = await prisma.organization.create({
    data: {
      name: "Global Tech Solutions",
      address: "99 Silicon Valley, CA",
      note: "Large tech business, interested in corporate training.",
      type: OrgType.BUSINESS,
      referral: "Agent 4 networking event",
      contactId: contact4.id, // Primary contact is contact4
      agentId: agent4.id, // Related to agent4
    },
  });

  console.log(`Created organizations: ${organization1.name}, ${organization2.name}, ${organization3.name}, ${organization4.name}`);

  // ---

  // 4. Create Products
  const product1 = await prisma.product.create({
    data: {
      name: "Custom Website Design",
      description: "Full service website design and deployment.",
      category: ProductCategory.SERVICE, // Using the ProductCategory enum
      contactId: contact1.id, // Related to contact1
      agentId: agent1.id, // Related to agent1
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Audio Production Package",
      description: "Equipment and technician for live music.",
      category: ProductCategory.PRODUCTION,
      contactId: contact2.id, // Related to contact2
      agentId: agent2.id, // Related to agent2
    },
  });
  
  const product3 = await prisma.product.create({
    data: {
      name: "Jazz Trio Performance",
      description: "Three-piece jazz band for background music.",
      category: ProductCategory.ENTERTAINER_MUSIC,
      contactId: contact3.id, // Related to contact3
      agentId: agent1.id, // Related to agent1
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: "Corporate Training Module",
      description: "Leadership and team-building course.",
      category: ProductCategory.SERVICE,
      contactId: contact4.id, // Related to contact4
      agentId: agent4.id, // Related to agent4
    },
  });

  const product5 = await prisma.product.create({
    data: {
      name: "Event T-Shirts (Merch)",
      description: "Custom printed cotton t-shirts for event staff.",
      category: ProductCategory.MERCHANDISE,
      contactId: contact5.id, // Related to contact5
      agentId: agent2.id, // Related to agent2
    },
  });

  console.log(`Created products: ${product1.name}, ${product2.name}, ${product3.name}, ${product4.name}, ${product5.name}`);

  // ---

  // 5. Create Events
  const event1 = await prisma.event.create({
    data: {
      name: "Annual Company Gala",
      gross_price: 15000.00,
      note: "Major networking event with 500+ attendees.",
      startDate: new Date("2026-03-15T18:00:00Z"),
      endDate: new Date("2026-03-15T23:00:00Z"),
      contactId: contact1.id, // Related to contact1
      agentId: agent1.id, // Related to agent1
      // Connect to the organization and product created above
      organizations: {
        connect: [{ id: organization1.id }]
      },
      products: {
        connect: [{ id: product1.id }]
      }
    },
  });
  
  const event2 = await prisma.event.create({
    data: {
      name: "Summer Music Showcase",
      gross_price: 5500.00,
      note: "A series of small live music performances.",
      startDate: new Date("2025-07-20T19:30:00Z"),
      endDate: new Date("2025-07-20T23:30:00Z"),
      contactId: contact3.id, // Related to contact3
      agentId: agent1.id, // Related to agent1
      organizations: {
        connect: [{ id: organization3.id }]
      },
      products: {
        connect: [{ id: product3.id }]
      }
    },
  });

  const event3 = await prisma.event.create({
    data: {
      name: "Q3 Leadership Seminar",
      gross_price: 8000.00,
      note: "Full-day training for executive staff.",
      startDate: new Date("2025-11-01T09:00:00Z"),
      endDate: new Date("2025-11-01T17:00:00Z"),
      contactId: contact4.id, // Related to contact4
      agentId: agent4.id, // Related to agent4
      organizations: {
        connect: [{ id: organization4.id }, { id: organization2.id }] // Connect to two organizations
      },
      products: {
        connect: [{ id: product4.id }]
      }
    },
  });

  const event4 = await prisma.event.create({
    data: {
      name: "Holiday Party (Internal)",
      gross_price: 3000.00,
      note: "Small gathering for internal team and families.",
      startDate: new Date("2025-12-12T17:00:00Z"),
      endDate: new Date("2025-12-12T22:00:00Z"),
      contactId: contact2.id, // Related to contact2
      agentId: agent2.id, // Related to agent2
    },
  });

  console.log(`Created events: ${event1.name}, ${event2.name}, ${event3.name}, ${event4.name}`);

  // ---

  // 6. Create Tasks
  const task1 = await prisma.task.create({
    data: {
      note: "Follow up with Jane Doe regarding contract signing.",
      complete: false,
      agentId: agent1.id, // Assigned to agent1
    },
  });

  const task2 = await prisma.task.create({
    data: {
      note: "Review John Smith's product requirements.",
      complete: true,
      closed: new Date(),
      agentId: agent2.id, // Assigned to agent2
    },
  });
  
  const task3 = await prisma.task.create({
    data: {
      note: "Draft proposal for The Blue Note Club.",
      complete: false,
      agentId: agent1.id, // Assigned to agent1
    },
  });

  const task4 = await prisma.task.create({
    data: {
      note: "Send thank-you email to Sara Connor for referral.",
      complete: true,
      closed: new Date("2025-05-10T10:00:00Z"),
      agentId: agent2.id, // Assigned to agent2
    },
  });

  const task5 = await prisma.task.create({
    data: {
      note: "Initial call with Global Tech Solutions' HR department.",
      complete: false,
      agentId: agent4.id, // Assigned to agent4
    },
  });


  console.log(`Created tasks: ${task1.note}, ${task2.note}, ${task3.note}, ${task4.note}, ${task5.note}`);

  // ---

  // 7. Create Reports
  const report1 = await prisma.report.create({
    data: {
      name: "Q4 Sales Overview",
    },
  });
  
  const report2 = await prisma.report.create({
    data: {
      name: "Agent Performance - May 2025",
    },
  });

  const report3 = await prisma.report.create({
    data: {
      name: "Top Contact Referrals YTD",
    },
  });

  const report4 = await prisma.report.create({
    data: {
      name: "Event Summary - 2024",
    },
  });

  console.log(`Created reports: ${report1.name}, ${report2.name}, ${report3.name}, ${report4.name}`);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })