import { z } from "zod"

export const contactSchema = z.object({
    id: z.string().optional(),
    firstName: z
        .string()
        .min(1, { message: "First name is required." }),
    lastName: z.string().optional(),
    titleId: z.string().optional(),
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    phones: z.array(z.object({
        id: z.string().optional(),
        phoneNumber: z.string(),
        phoneTypeId: z.string(),
    })).optional(),
    note: z.string().optional(),
    referral: z.string().optional(),
    jobTitle: z.string().optional(),
    agentId: z.string().optional(),
})

export type ContactSchema = z.infer<typeof contactSchema>

export const eventSchema = z.object({
    id: z.string().optional(),
    name: z
        .string()
        .min(1, { message: "Event name is required." }),
    clientPersonEntityId: z.string().optional(),
    clientOrganizationEntityId: z.string().optional(),
    venuePersonEntityId: z.string().optional().or(z.literal("")),
    venueOrganizationEntityId: z.string().optional().or(z.literal("")),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    eventTypeId: z.string().optional(),
    billingContactPersonEntityId: z.string().optional().or(z.literal("")),
    billingContactOrganizationEntityId: z.string().optional().or(z.literal("")),
    budget: z.string().optional(),
    agentId: z.string().optional(),
    eventStatusId: z.string().optional(),
    contractSentDate: z.string().optional(),
    contractReturnedDate: z.string().optional(),
    eventForm: z.enum(["YES", "NO", "N_A"]).optional(),
    attendance: z.string().optional(),
    guestArrivalTime: z.string().optional(),
    reportTo: z.string().optional(),
    breakArea: z.string().optional(),
    equipmentStorage: z.string().optional(),
    note: z.string().optional(),
})

export type EventSchema = z.infer<typeof eventSchema>

export const organizationSchema = z.object({
    id: z.string().optional(),
    name: z
        .string()
        .min(1, { message: "Name is required." }),
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    phones: z.array(z.object({
        id: z.string().optional(),
        phoneNumber: z.string(),
        phoneTypeId: z.string(),
    })).optional(),
    electronicAddresses: z.array(z.object({
        id: z.string().optional(),
        electronicAddress: z.string(),
        electronicAddressTypeId: z.string(),
    })).optional(),
    note: z.string().optional(),
    organizationTypes: z.array(z.string()).optional(),
    dynamicLists: z.array(z.string()).optional(),
    type: z.string().optional(),
    referral: z.string().optional(),
    agentId: z.string().optional(),
    /*
    resources: z.string().optional(),
    contactId: z.string().min(1, { message: "Contact is required!" }), */
})

export type OrganizationSchema = z.infer<typeof organizationSchema>

export const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: "Name is required." }),
    electronicAddresses: z.array(z.object({
        id: z.string().optional(),
        electronicAddress: z.string(),
        electronicAddressTypeId: z.string(),
    })).optional(),
    bookingContactId: z.string().optional(),
    phones: z.array(z.object({
        id: z.string().optional(),
        phoneNumber: z.string(),
        phoneTypeId: z.string(),
    })).optional(),
    grossPrice: z.string().optional(),
    feePercent: z.string().optional(),
    available: z.boolean(),
    note: z.string().optional(),
    productTypeId: z.string().min(1, { message: "Product Type is required!" }),
    categories: z.array(z.string()).optional(),
    description: z.string().optional(),
})

export type ProductSchema = z.infer<typeof productSchema>

export const entertainerSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    electronicAddresses: z.array(z.object({
        id: z.string().optional(),
        electronicAddress: z.string(),
        electronicAddressTypeId: z.string(),
    })).optional(),
    bookingContactPersonEntityId: z.string().optional(),
    bookingContactOrganizationEntityId: z.string().optional(),
    phones: z.array(z.object({
        id: z.string().optional(),
        phoneNumber: z.string(),
        phoneTypeId: z.string(),
    })).optional(),
    grossPrice: z.string().optional(),
    feePercent: z.string().optional(),
    available: z.string().optional(),
    note: z.string().optional(),
    productTypeId: z.string().optional(),
    categories: z.array(z.string()).optional(),
    description: z.string().optional(),
    bio: z.string().optional(),
    specialRequirements: z.string().optional(),
    businessCards: z.string().optional(),
    active: z.string().optional(),
    leaderId: z.string().optional(),
    size: z.string().optional(),
    exclusive: z.string().optional(),
    agentId: z.string().optional(),
})

export type EntertainerSchema = z.infer<typeof entertainerSchema>

export const reportSchema = z.object({
    id: z.string().optional(),
    name: z
        .string()
        .min(1, { message: "Name is required." }),
})

export type ReportSchema = z.infer<typeof reportSchema>

export const taskSchema = z.object({
    id: z.string().optional(),
    note: z
        .string()
        .min(1, { message: "Name is required." }),
    agentId: z.string().min(1, { message: "Agent is required!" }),
})

export type TaskSchema = z.infer<typeof taskSchema>


export const eventProductSchema = z.object({
    id: z.string().optional(),
    productEntityId: z.string().min(1, { message: "Product is required!" }),
    eventEntityId: z.string().min(1, { message: "Event is required!" }),
    bookingContactPersonEntityId: z.string().optional(),
    bookingContactOrganizationEntityId: z.string().optional(),
    venuePersonEntityId: z.string().optional(),
    venueOrganizationEntityId: z.string().optional(),
    venueOrganizationResourceId: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    setupBy: z.string().optional(),
    bandSize: z.string().optional(),
    attire: z.string().optional(),
    contractedToProvide: z.string().optional(),
    note: z.string().optional(),
    productStatusId: z.string().min(1, { message: "Product Status is required!" }),
    contractSentDate: z.string().optional(),
    contractReturnedDate: z.string().optional(),
    deposit: z.string().optional(),
    paymentTerms: z.string().optional(),
    grossPrice: z.string().optional(),
    feePercent: z.string().optional(),
    clientProvides: z.string().optional(),
    specialInstructions: z.string().optional(),
})

export type EventProductSchema = z.infer<typeof eventProductSchema>


export const organizationPersonSchema = z.object({
    organizationEntityId: z.string().min(1, { message: "Organization is required!" }),
    personEntityId: z.string().min(1, { message: "Person is required!" }),

})

export type OrganizationPersonSchema = z.infer<typeof organizationPersonSchema>