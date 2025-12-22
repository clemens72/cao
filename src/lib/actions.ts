"use server"

import {
  ContactSchema,
  EventSchema,
  OrganizationSchema,
  ProductSchema,
  ReportSchema,
  TaskSchema,
} from "./formValidationSchemas"
import prisma from "./prisma";

type CurrentState = { success: boolean, error: boolean }

export const createContact = async (
  currentState: CurrentState,
  data: ContactSchema) => {
  try {
    await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        agentId: data.agentId
      },
    });
    return { success: true, error: false }
  } catch (err) {
    console.log(err);
    return { success: false, error: true }
  }
}

export const updateContact = async (
  currentState: CurrentState,
  data: ContactSchema
) => {
  try {
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        agentId: data.agentId
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteContact = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createEvent = async (
  currentState: CurrentState,
  data: EventSchema) => {
  try {
    await prisma.event.create({
      data: {
        name: data.name,
        note: data.note,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
    return { success: true, error: false }
  } catch (err) {
    console.log(err);
    return { success: false, error: true }
  }
}

export const updateEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  try {
    await prisma.event.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        note: data.note,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.event.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createOrganization = async (
  currentState: CurrentState,
  data: OrganizationSchema) => {
  try {
    await prisma.organization.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        type: data.type || null,
        address1: data.address1 || null,
        address2: data.address2 || null,
        note: data.note || null,
        resources: data.resources || null,
        city: data.city || null,
        state: data.state || null,
        zip: data.zip || null,
        country: data.country || null,
        contactId: data.contactId || null,
        agentId: data.agentId || null,
        //createdBy: data.createdBy || null,
      },
    });
    return { success: true, error: false }
  } catch (err) {
    console.log(err);
    return { success: false, error: true }
  }
}

export const updateOrganization = async (
  currentState: CurrentState,
  data: OrganizationSchema
) => {
  try {
    await prisma.organization.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        type: data.type || null,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteOrganization = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.organization.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createProduct = async (
  currentState: CurrentState,
  data: ProductSchema) => {
  try {
    await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
    return { success: true, error: false }
  } catch (err) {
    console.log(err);
    return { success: false, error: true }
  }
}

export const updateProduct = async (
  currentState: CurrentState,
  data: ProductSchema
) => {
  try {
    await prisma.product.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteProduct = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

/* export const createReport = async (
  currentState: CurrentState,
  data: ReportSchema) => {
  try {
    await prisma.report.create({
      data: {
        name: data.name,
      },
    });
    return { success: true, error: false }
  } catch (err) {
    console.log(err);
    return { success: false, error: true }
  }
}

export const updateReport = async (
  currentState: CurrentState,
  data: ReportSchema
) => {
  try {
    await prisma.report.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteReport = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.report.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
}; */

export const createTask = async (
  currentState: CurrentState,
  data: TaskSchema) => {
  try {
    await prisma.task.create({
      data: {
        note: data.note,
        agentId: data.agentId,
      },
    });
    return { success: true, error: false }
  } catch (err) {
    console.log(err);
    return { success: false, error: true }
  }
}

export const updateTask = async (
  currentState: CurrentState,
  data: TaskSchema
) => {
  try {
    await prisma.task.update({
      where: {
        id: data.id,
      },
      data: {
        note: data.note,
        agentId: data.agentId,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTask = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.task.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};