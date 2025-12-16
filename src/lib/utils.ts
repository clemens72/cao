import prisma from "./prisma";

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return ""; // Handle invalid dates

  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(d.getDate()).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2); // Last two digits

  return `${month}-${day}-${year}`;
}

export async function getAgentName(agentId: number): Promise<string> {
  if (!agentId) return "Unknown";

  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    select: { fname: true, lname: true },
  });

  if (!agent) return "Unknown";

  return `${agent.fname} ${agent.lname}`;
}

export async function getContactName(contactId: number): Promise<string> {
  if (!contactId) return "Unknown";

  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    select: { fname: true, lname: true },
  });

  if (!contact) return "Unknown";

  return `${contact.fname} ${contact.lname}`;
}

export async function getContactNumber(contactId: number): Promise<string> {
  if (!contactId) return "Unknown";

  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    select: { phone: true },
  });

  if (!contact) return "Unknown";

  return contact.phone || "No Phone";
}

export async function getContactEmail(contactId: number): Promise<string> {
  if (!contactId) return "Unknown";

  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    select: { email: true },
  });

  if (!contact) return "Unknown";

  return contact.email;
}