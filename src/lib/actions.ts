"use server"

import { en } from "zod/locales";
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
    const entityType = await prisma.entityType.findFirst({
      where: { description: "Person" },
    });
    const entity = await prisma.entity.create({
      data: {
        entityTypeId: entityType?.id || "",
        createDate: new Date(),
      },
    });
    await prisma.person.create({
      data: {
        entityId: entity.id,
        firstName: data.firstName,
        lastName: data.lastName,
        titleId: data.titleId,
        note: data.note,
        referredBy: data.referral,
        jobTitle: data.jobTitle,
        agentPersonEntityId: data.agentId,
      },
    })
    await prisma.address.create({
      data: {
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        stateId: data.state,
        zip: data.zip,
        countryId: data.country,
        entityId: entity.id,
      }
    })

    // Handle phones if they exist
    if (data.phones && data.phones.length > 0) {
      for (const phone of data.phones) {
        if (phone.phoneNumber && phone.phoneTypeId) {
          await prisma.phone.create({
            data: {
              phoneNumber: phone.phoneNumber,
              phoneTypeId: phone.phoneTypeId,
              entityId: entity.id,
            }
          });
        }
      }
    }

    // Handle electronic addresses if they exist
    /* if (data.electronicAddresses && data.electronicAddresses.length > 0) {
      for (const electronicAddress of data.electronicAddresses) {
        if (electronicAddress.address && electronicAddress.electronicAddressTypeId) {
          await prisma.electronicAddress.create({
            data: {
              address: electronicAddress.address,
              electronicAddressTypeId: electronicAddress.electronicAddressTypeId,
              entityId: entity.id,
            }
          });
        }
      }
    } */

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
    await prisma.person.update({
      where: {
        entityId: data.id
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        titleId: data.titleId,
        note: data.note,
        referredBy: data.referral,
        jobTitle: data.jobTitle,
        agentPersonEntityId: data.agentId,
      },
    })
    // Handle address - create if doesn't exist, update if exists
    const existingAddress = await prisma.address.findFirst({
      where: { entityId: data.id }
    });

    if (existingAddress) {
      await prisma.address.update({
        where: { id: existingAddress.id },
        data: {
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          stateId: data.state,
          zip: data.zip,
          countryId: data.country,
        }
      });
    } else {
      const countryId = await prisma.country.findFirst({
        where: { description: "United States" }
      })
      await prisma.address.create({
        data: {
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          stateId: data.state,
          zip: data.zip,
          countryId: countryId?.id,
          entityId: data.id!,
        }
      });
    }

    // Handle phones - update existing, create new, and delete removed
    if (data.phones && data.phones.length > 0) {
      // Get existing phone IDs from the database
      const existingPhones = await prisma.phone.findMany({
        where: { entityId: data.id },
        select: { id: true }
      });
      
      const submittedPhoneIds = data.phones
        .map(p => p.id)
        .filter((id): id is string => !!id);

      // Delete phones that were removed (exist in DB but not in submitted data)
      const phonesToDelete = existingPhones
        .filter(existing => !submittedPhoneIds.includes(existing.id))
        .map(p => p.id);

      if (phonesToDelete.length > 0) {
        await prisma.phone.deleteMany({
          where: {
            id: { in: phonesToDelete }
          }
        });
      }

      // Update existing phones or create new ones
      for (const phone of data.phones) {
        if (phone.phoneNumber && phone.phoneTypeId) {
          if (phone.id) {
            // Update existing phone
            await prisma.phone.update({
              where: { id: phone.id },
              data: {
                phoneNumber: phone.phoneNumber,
                phoneTypeId: phone.phoneTypeId,
              }
            });
          } else {
            // Create new phone
            await prisma.phone.create({
              data: {
                phoneNumber: phone.phoneNumber,
                phoneTypeId: phone.phoneTypeId,
                entityId: data.id!,
              }
            });
          }
        }
      }
    }
    
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
    await prisma.address.deleteMany({
      where: {
        entityId: id,
      },
    });
    await prisma.phone.deleteMany({
      where: {
        entityId: id,
      },
    });

    await prisma.person.delete({
      where: {
        entityId: id,
      },
    });
    await prisma.entity.delete({
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
    const entityType = await prisma.entityType.findFirst({
      where: { description: "Event" },
    });
    const entity = await prisma.entity.create({
      data: {
        entityTypeId: entityType?.id || "",
        createDate: new Date(),
      },
    });
    await prisma.event.create({
      data: {
        entityId: entity.id,
        name: data.name,
        note: data.note,
        startDate: data.startDate,
        endDate: data.endDate,
        clientPersonEntityId: data.clientId,
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
    console.log("Updating event with data:", data);
    await prisma.event.update({
      where: {
        entityId: data.id
      },
      data: {
        name: data.name,
        clientPersonEntityId: data.clientId,
        venueOrganizationEntityId: data.venueId,
        location: data.location,
        startDate: data.startDate + ":00.00Z",
        endDate: data.endDate + ":00.00Z",
        eventTypeId: data.eventTypeId,
        billingContactPersonEntityId: data.billingContactId,
        budget: data.budget,
        agentPersonEntityId: data.agentId,
        eventStatusId: data.eventStatusId,
        contractSentDate: data.contractSentDate,
        contractReturnedDate: data.contractReturnedDate,
        eventForm: data.eventForm,
        attendance: data.attendance,
        guestArrivalTime: data.guestArrivalTime,
        reportTo: data.reportTo,
        breakArea: data.breakArea,
        equipmentStorage: data.equipmentStorage,
        note: data.note,
      },
    })
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
        entityId: id,
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
    const entityType = await prisma.entityType.findFirst({
      where: { description: "Organization" },
    });
    const entity = await prisma.entity.create({
      data: {
        entityTypeId: entityType?.id || "",
        createDate: new Date(),
      },
    });
    await prisma.organization.create({
      data: {
        name: data.name,
        note: data.note,
        referredBy: data.referral,
        entityId: entity.id,
        agentPersonEntityId: data.agentId,
      },
    })
    await prisma.address.create({
      data: {
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        stateId: data.state,
        zip: data.zip,
        countryId: data.country,
        entityId: entity.id,
      }
    })

    // Handle phones if they exist
    if (data.phones && data.phones.length > 0) {
      for (const phone of data.phones) {
        if (phone.phoneNumber && phone.phoneTypeId) {
          await prisma.phone.create({
            data: {
              phoneNumber: phone.phoneNumber,
              phoneTypeId: phone.phoneTypeId,
              entityId: entity.id,
            }
          });
        }
      }
    }

    // Handle electronic addresses if they exist
    if (data.electronicAddresses && data.electronicAddresses.length > 0) {
      for (const ea of data.electronicAddresses) {
        if (ea.electronicAddress && ea.electronicAddressTypeId) {
          await prisma.electronicAddress.create({
            data: {
              electronicAddress: ea.electronicAddress,
              electronicAddressTypeId: ea.electronicAddressTypeId,
              entityId: entity.id,
            }
          });
        }
      }
    }

    // Handle organization types if they exist
    if (data.organizationTypes && data.organizationTypes.length > 0) {
      for (const typeId of data.organizationTypes) {
        await prisma.organizationTypes.create({
          data: {
            organizationEntityId: entity.id,
            organizationTypeId: typeId,
          }
        });
      }
    }

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
        entityId: data.id
      },
      data: {
        name: data.name,
        note: data.note,
        referredBy: data.referral,
        agentPersonEntityId: data.agentId,
      },
    })
    // Handle address - create if doesn't exist, update if exists
    const existingOrgAddress = await prisma.address.findFirst({
      where: { entityId: data.id }
    });

    if (existingOrgAddress) {
      await prisma.address.update({
        where: { id: existingOrgAddress.id },
        data: {
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          stateId: data.state,
          zip: data.zip,
          countryId: data.country,
        }
      });
    } else {
      await prisma.address.create({
        data: {
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          stateId: data.state,
          zip: data.zip,
          countryId: data.country,
          entityId: data.id!,
        }
      });
    }

    // Handle phones - update existing, create new, and delete removed
    if (data.phones && data.phones.length > 0) {
      // Get existing phone IDs from the database
      const existingPhones = await prisma.phone.findMany({
        where: { entityId: data.id },
        select: { id: true }
      });
      
      const submittedPhoneIds = data.phones
        .map(p => p.id)
        .filter((id): id is string => !!id);

      // Delete phones that were removed (exist in DB but not in submitted data)
      const phonesToDelete = existingPhones
        .filter(existing => !submittedPhoneIds.includes(existing.id))
        .map(p => p.id);

      if (phonesToDelete.length > 0) {
        await prisma.phone.deleteMany({
          where: {
            id: { in: phonesToDelete }
          }
        });
      }

      // Update existing phones or create new ones
      for (const phone of data.phones) {
        if (phone.phoneNumber && phone.phoneTypeId) {
          if (phone.id) {
            // Update existing phone
            await prisma.phone.update({
              where: { id: phone.id },
              data: {
                phoneNumber: phone.phoneNumber,
                phoneTypeId: phone.phoneTypeId,
              }
            });
          } else {
            // Create new phone
            await prisma.phone.create({
              data: {
                phoneNumber: phone.phoneNumber,
                phoneTypeId: phone.phoneTypeId,
                entityId: data.id!,
              }
            });
          }
        }
      }
    }

    // Handle electronic addresses - update existing, create new, and delete removed
    if (data.electronicAddresses && data.electronicAddresses.length > 0) {
      // Get existing electronic address IDs from the database
      const existingElectronicAddresses = await prisma.electronicAddress.findMany({
        where: { entityId: data.id },
        select: { id: true }
      });
      
      const submittedElectronicAddressIds = data.electronicAddresses
        .map(ea => ea.id)
        .filter((id): id is string => !!id);

      // Delete electronic addresses that were removed
      const electronicAddressesToDelete = existingElectronicAddresses
        .filter(existing => !submittedElectronicAddressIds.includes(existing.id))
        .map(ea => ea.id);

      if (electronicAddressesToDelete.length > 0) {
        await prisma.electronicAddress.deleteMany({
          where: {
            id: { in: electronicAddressesToDelete }
          }
        });
      }

      // Update existing electronic addresses or create new ones
      for (const ea of data.electronicAddresses) {
        if (ea.electronicAddress && ea.electronicAddressTypeId) {
          if (ea.id) {
            // Update existing electronic address
            await prisma.electronicAddress.update({
              where: { id: ea.id },
              data: {
                electronicAddress: ea.electronicAddress,
                electronicAddressTypeId: ea.electronicAddressTypeId,
              }
            });
          } else {
            // Create new electronic address
            await prisma.electronicAddress.create({
              data: {
                electronicAddress: ea.electronicAddress,
                electronicAddressTypeId: ea.electronicAddressTypeId,
                entityId: data.id!,
              }
            });
          }
        }
      }
    }

    // Handle organization types - update existing, create new, and delete removed
    if (data.organizationTypes) {
      // Get existing organization type IDs from the database
      const existingOrgTypes = await prisma.organizationTypes.findMany({
        where: { organizationEntityId: data.id },
        select: { id: true, organizationTypeId: true }
      });

      const submittedTypeIds = data.organizationTypes;

      // Delete organization types that were removed
      const typesToDelete = existingOrgTypes
        .filter(existing => !submittedTypeIds.includes(existing.organizationTypeId))
        .map(t => t.id);

      if (typesToDelete.length > 0) {
        await prisma.organizationTypes.deleteMany({
          where: {
            id: { in: typesToDelete }
          }
        });
      }

      // Create new organization types (ones that don't already exist)
      const existingTypeIds = existingOrgTypes.map(t => t.organizationTypeId);
      const newTypeIds = submittedTypeIds.filter(typeId => !existingTypeIds.includes(typeId));

      for (const typeId of newTypeIds) {
        await prisma.organizationTypes.create({
          data: {
            organizationEntityId: data.id!,
            organizationTypeId: typeId,
          }
        });
      }
    }
    
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
    await prisma.address.deleteMany({
      where: {
        entityId: id,
      },
    });
    await prisma.phone.deleteMany({
      where: {
        entityId: id,
      },
    });
    await prisma.electronicAddress.deleteMany({
      where: {
        entityId: id,
      },
    });
    await prisma.organizationTypes.deleteMany({
      where: {
        organizationEntityId: id,
      },
    });

    await prisma.organization.delete({
      where: {
        entityId: id,
      },
    });
    await prisma.entity.delete({
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
    const entityType = await prisma.entityType.findFirst({
      where: { description: "Product" },
    });
    const entity = await prisma.entity.create({
      data: {
        entityTypeId: entityType?.id || "",
        createDate: new Date(),
      },
    });
    await prisma.product.create({
      data: {
        entityId: entity.id,
        name: data.name,
        bookingContactPersonEntityId: data.bookingContactId,
        grossPrice: data.grossPrice,
        feePercent: data.feePercent,
        available: data.available,
        note: data.note,
        productTypeId: data.productTypeId,
        description: data.description,
      },
    });
    // Handle electronic addresses if they exist
    if (data.electronicAddresses && data.electronicAddresses.length > 0) {
      for (const ea of data.electronicAddresses) {
        if (ea.electronicAddress && ea.electronicAddressTypeId) {
          await prisma.electronicAddress.create({
            data: {
              electronicAddress: ea.electronicAddress,
              electronicAddressTypeId: ea.electronicAddressTypeId,
              entityId: entity.id,
            }
          });
        }
      }
    }

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
        entityId: data.id,
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
        entityId: id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createEntertainer = async (
  currentState: CurrentState,
  data: ProductSchema) => {
  try {
    const entityType = await prisma.entityType.findFirst({
      where: { description: "Product" },
    });
    const entity = await prisma.entity.create({
      data: {
        entityTypeId: entityType?.id || "",
        createDate: new Date(),
      },
    });
    await prisma.product.create({
      data: {
        entityId: entity.id,
        name: data.name,
        bookingContactPersonEntityId: data.bookingContactId,
        grossPrice: data.grossPrice,
        feePercent: data.feePercent,
        available: data.available,
        note: data.note,
        productTypeId: data.productTypeId,
        description: data.description,
      },
    });
    // Handle electronic addresses if they exist
    if (data.electronicAddresses && data.electronicAddresses.length > 0) {
      for (const ea of data.electronicAddresses) {
        if (ea.electronicAddress && ea.electronicAddressTypeId) {
          await prisma.electronicAddress.create({
            data: {
              electronicAddress: ea.electronicAddress,
              electronicAddressTypeId: ea.electronicAddressTypeId,
              entityId: entity.id,
            }
          });
        }
      }
    }
    return { success: true, error: false }
  } catch (err) {
    console.log(err);
    return { success: false, error: true }
  }
}

export const updateEntertainer = async (
  currentState: CurrentState,
  data: ProductSchema
) => {
  try {
    await prisma.product.update({
      where: {
        entityId: data.id,
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

export const deleteEntertainer = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.product.delete({
      where: {
        entityId: id,
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
    /* await prisma.task.create({
      data: {
        note: data.note,
      },
    }); */
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
    /* await prisma.task.update({
      where: {
        id: data.id,
      },
      data: {
        note: data.note,
        agentId: data.agentId,
      },
    }); */
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