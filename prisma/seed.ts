import { PrismaClient, EventStatus, EventForm, ProductType } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. GLOBAL LOOKUPS (Roles, Event Types, Categories)
  const agentRole = await prisma.role.upsert({
    where: { id: 'role-agent-uuid' },
    update: {},
    create: { id: 'role-agent-uuid', name: 'agent' },
  });

  const clientRole = await prisma.role.upsert({
    where: { id: 'role-client-uuid' },
    update: {},
    create: { id: 'role-client-uuid', name: 'client' },
  });

  const corpEventType = await prisma.eventType.create({
    data: { name: 'Corporate Gala' },
  });

  const catMusic = await prisma.category.create({ 
    data: { name: 'Live Music' } 
  });

  // 2. USERS (Agents)
  const agent1 = await prisma.user.create({
    data: {
      username: 'sarah_agent',
      email: 'sarah@talent-agency.com',
      firstName: 'Sarah',
      lastName: 'Connor',
      enabled: true,
      roles: { connect: { id: agentRole.id } },
    },
  });

  const agent2 = await prisma.user.create({
    data: {
      username: 'mike_booking',
      email: 'mike@talent-agency.com',
      firstName: 'Michael',
      lastName: 'Scott',
      enabled: true,
      roles: { connect: { id: agentRole.id } },
    },
  });

  // 3. USERS (Clients) - Assigned to Agents
  const clientUser1 = await prisma.user.create({
    data: {
      username: 'corp_tech_buyer',
      email: 'john.tech@globalcorp.com',
      firstName: 'John',
      lastName: 'Tech',
      enabled: true,
      agentId: agent1.id,
      roles: { connect: { id: clientRole.id } },
    },
  });

  const clientUser2 = await prisma.user.create({
    data: {
      username: 'wedding_planner_99',
      email: 'amy@dreamweddings.com',
      firstName: 'Amy',
      lastName: 'Santiago',
      enabled: true,
      agentId: agent1.id,
      roles: { connect: { id: clientRole.id } },
    },
  });

  // 4. ORGANIZATIONS (Venues & Client Corps)
  const mainVenue = await prisma.organization.create({
    data: {
      name: 'The Grand Ballroom',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      type: 'Venue',
      agentId: agent1.id,
    },
  });

  const clientOrg = await prisma.organization.create({
    data: {
      name: 'Global Tech Corp',
      email: 'events@globalcorp.com',
      type: 'Corporate',
      agentId: agent1.id,
      contactId: clientUser1.id,
    },
  });

  // 5. PRODUCTS
  const jazzBand = await prisma.product.create({
    data: {
      name: 'Midnight Jazz Quartet',
      grossPrice: 2500.00,
      feePercent: 0.15,
      type: ProductType.ENTERTAINER_MUSIC,
      agentId: agent1.id,
      categories: { connect: { id: catMusic.id } },
    },
  });

  // 6. EVENTS
  const galaEvent = await prisma.event.create({
    data: {
      name: 'Annual Tech Gala 2025',
      budget: 15000.00,
      status: EventStatus.BOOKED,
      form: EventForm.YES,
      startDate: new Date('2025-12-31T19:00:00Z'),
      endDate: new Date('2025-12-31T23:59:59Z'),
      clientOrgId: clientOrg.id,
      venueId: mainVenue.id,
      agentId: agent1.id,
      eventTypeId: corpEventType.id,
      clientContactId: clientUser1.id,
    },
  });

  // 7. EVENT-PRODUCT LINK (The Pitch)
  await prisma.eventProduct.create({
    data: {
      name: 'Main Stage Performance',
      eventId: galaEvent.id,
      productId: jazzBand.id,
    },
  });

  // 8. TASKS
  await prisma.task.create({
    data: {
      note: 'Send contract to Global Tech Corp',
      complete: false,
      createdById: agent1.id,
      ownerId: agent1.id,
      events: { connect: { id: galaEvent.id } },
      organizations: { connect: { id: clientOrg.id } }
    },
  });

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });