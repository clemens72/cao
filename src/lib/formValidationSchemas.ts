import { z } from "zod"

export const contactSchema = z.object({
    id: z.string().optional(),
    email: z.string().email({ message: "Invalid email address." }),
    firstName: z
        .string()
        .min(1, { message: "First name is required." }),
    lastName: z
        .string()
        .min(1, { message: "Last name is required." }),
    phone: z.string().optional(),
    address: z.string().optional(),
    note: z.string().optional(),
    agentId: z.string().min(1, { message: "Agent is required!" }),
})

export type ContactSchema = z.infer<typeof contactSchema>

export const eventSchema = z.object({
    id: z.string().optional(),
    name: z
        .string()
        .min(1, { message: "First name is required." }),
    gross_price: z.coerce.number({ message: "Gross price must be a number!" }),
    note: z.string().optional(),
    startDate: z.coerce.date({ message: "Start date is required!" }),
    endDate: z.coerce.date({ message: "End date is required!" }),
    contactId: z.string().min(1, { message: "Contact is required!" }),
    agentId: z.string().min(1, { message: "Agent is required!" }),
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
    phone: z.string().optional(),
    email: z.string().optional(),
    type: z.string().optional(),
    resources: z.string().optional(),
    note: z.string().optional(),
    referral: z.string().optional(),
    agentId: z.string().min(1, { message: "Agent is required!" }),
    contactId: z.string().min(1, { message: "Contact is required!" }),
})

export type OrganizationSchema = z.infer<typeof organizationSchema>

export const productSchema = z.object({
    id: z.string().optional(),
    name: z
        .string()
        .min(1, { message: "Name is required." }),
    description: z
        .string()
        .min(1, { message: "Description is required." }),
    category: z.enum(["PRODUCTION", "SERVICE", "MERCHANDISE", "ENTERTAINER_MUSIC", "ENTERTAINER_NON_MUSIC"],
        { message: "Category is required." }),
    contactId: z.string().min(1, { message: "Contact is required!" }),
    agentId: z.string().min(1, { message: "Agent is required!" }),
})

export type ProductSchema = z.infer<typeof productSchema>

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