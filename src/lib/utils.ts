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

export function formatDateTimeLocal(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export async function getEntityType(entityTypeId: string | null): Promise<string> {
  if (!entityTypeId) return "Unknown";
  const entityType = await prisma.entityType.findUnique({
    where: { id: entityTypeId },
    select: { description: true },
  });
  return entityType?.description || "Unknown";
}

export async function getPhoneType(phoneTypeId: string | null): Promise<string> {
  if (!phoneTypeId) return "Unknown";
  const phoneType = await prisma.phoneType.findUnique({
    where: { id: phoneTypeId },
    select: { description: true },
  });
  return phoneType?.description || "Unknown";
}

export async function getElectronicAddressType(eaTypeId: string | null): Promise<string> {
  if (!eaTypeId) return "Unknown";
  const eaType = await prisma.electronicAddressType.findUnique({
    where: { id: eaTypeId },
    select: { description: true },
  });
  return eaType?.description || "Unknown";
}

export async function getPersonName(id: string | null): Promise<string> {
  if (!id) return "Unknown";

  const p = await prisma.person.findUnique({
    where: { entityId: id },
    select: { firstName: true, lastName: true },
  });

  if (!p) return "Unknown";

  return `${p.firstName} ${p.lastName}` || "No Name";
}

export async function getProductCategoryName(id: string | null): Promise<string> {
  if (!id) return "Unknown";
  const category = await prisma.productTypeCategory.findUnique({
    where: { id },
    select: { description: true },
  });
  return category?.description || "Unknown";
}

export async function getOrganizationType(id: string | null): Promise<string[]> {
  if (!id) return [];
  
  const orgTypes = await prisma.organizationTypes.findMany({
    where: { organizationEntityId: id },
    select: { organizationTypeId: true },
  });
  
  if (!orgTypes || orgTypes.length === 0) return [];
  
  // Get descriptions for each organizationTypeId
  const descriptions = await Promise.all(
    orgTypes.map(async (org) => {
      const orgType = await prisma.organizationType.findUnique({
        where: { id: org.organizationTypeId },
        select: { description: true },
      });
      return orgType?.description || "Unknown";
    })
  );
  
  return descriptions;
}

export async function getProductType(id: string | null): Promise<string> {
  if (!id) return "Unknown";
  const productType = await prisma.productType.findUnique({
    where: { id },
    select: { description: true },
  });
  return productType?.description || "Unknown";
}

export async function getProductName(id: string | null): Promise<string> {
  if (!id) return "Unknown";
  const product = await prisma.product.findUnique({
    where: { entityId: id },
    select: { name: true },
  });
  return product?.name || "Unknown";
}

export async function getProductStatus(id: string | null): Promise<string> {
  if (!id) return "Unknown";
  const status = await prisma.productStatus.findUnique({
    where: { id },
    select: { description: true },
  });
  return status?.description || "Unknown";
}

export async function getOrganiationName(id: string | null): Promise<string> {
  if (!id) return "Unknown";
  const organization = await prisma.organization.findUnique({
    where: { entityId: id },
    select: { name: true },
  });
  return organization?.name || "Unknown";
}