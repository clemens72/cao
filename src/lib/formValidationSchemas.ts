import { z } from "zod"

export const contactSchema = z.object({
    id: z.string().optional(),
    firstName: z
        .string()
        .min(1, { message: "First name is required." }),
    lastName: z
        .string()
        .min(1, { message: "Last name is required." }),
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
    agentId: z.string().min(1, { message: "Agent is required!" }),
})

export type ContactSchema = z.infer<typeof contactSchema>

export const eventSchema = z.object({
    id: z.string().optional(),
    name: z
        .string()
        .min(1, { message: "First name is required." }),
    clientId: z.string().min(1, { message: "Client is required!" }),
    venueId: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    eventTypeId: z.string().optional(),
    billingContactId: z.string().optional(),
    budget: z.string().optional(),
    agentId: z.string().min(1, { message: "Agent is required!" }),
    eventStatusId: z.string().optional(),
    contractSentDate: z.string().optional(),
    contractReturnedDate: z.string().optional(),
    eventForm: z.enum(["YES", "NO", "N_A"], { message: "Event Form is required!" }).optional(),
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
    state: z.string().min(1, { message: "State is required." }),
    zip: z.string().optional(),
    country: z.string().min(1, { message: "Country is required." }),
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
    agentId: z.string().min(1, { message: "Agent is required!" }),
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
    bookingContactId: z.string().optional(),
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