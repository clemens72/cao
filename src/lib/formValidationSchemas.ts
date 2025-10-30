import { z } from "zod"

export const contactSchema = z.object({
    id: z.coerce.number().optional(),
    email: z.string().email({ message: "Invalid email address." }),
    fname: z
        .string()
        .min(1, { message: "First name is required." }),
    lname: z
        .string()
        .min(1, { message: "Last name is required." }),
    phone: z.string().optional(),
    address: z.string().optional(),
    agentId: z.coerce.number().min(1, { message: "Agent is required!" }),
})

export type ContactSchema = z.infer<typeof contactSchema>

export const eventSchema = z.object({
    id: z.coerce.number().optional(),
    name: z
        .string()
        .min(1, { message: "First name is required." }),
    gross_price: z.coerce.number({ message: "Gross price must be a number!" }),
    startDate: z.coerce.date({ message: "Start date is required!" }),
    endDate: z.coerce.date({ message: "End date is required!" }),
    contactId: z.coerce.number().min(1, { message: "Contact is required!" }),
    agentId: z.coerce.number().min(1, { message: "Agent is required!" }),
})

export type EventSchema = z.infer<typeof eventSchema>

export const organizationSchema = z.object({
    id: z.coerce.number().optional(),
    name: z
        .string()
        .min(1, { message: "Name is required." }),
    address: z.string().optional(),
    note: z.string().optional(),
    type: z.enum([
        "AGENCY",
        "BANQUET_FACILITY",
        "BAR",
        "BUSINESS",
        "CASINO",
        "CHURCH",
        "CONCERT_VENUE",
        "CONVENTION_CENTER",
        "COUNTRY_CLUB",
        "EVENT_COMPLEX",
        "FESTIVAL_SITE",
        "FINE_ARTS_FACILITIES",
        "FRATERNAL_ORGANIZATION",
        "GOVERNMENT",
        "HOSPITAL",
        "HOTEL",
        "LIBRARY_MUSEUM",
        "LIVING_FACILITIES",
        "OTHER",
        "PARK",
        "PRISONS",
        "PRIVATE_HOME",
        "RECREATION_COMMUNITY_CENTER",
        "RESTAURANT",
        "RETAIL",
        "SCHOOL",
        "SPORTS_FACILITY",
        "THEATER",
        "UNIVERSITIES",
    ],
        { message: "Category is required." }),
        
    referral: z.string().optional(),
    contactId: z.coerce.number().min(1, { message: "Contact is required!" }),
    agentId: z.coerce.number().min(1, { message: "Agent is required!" }),
})

export type OrganizationSchema = z.infer<typeof organizationSchema>

export const productSchema = z.object({
    id: z.coerce.number().optional(),
    name: z
        .string()
        .min(1, { message: "Name is required." }),
    description: z
        .string()
        .min(1, { message: "Description is required." }),
    category: z.enum(["PRODUCTION", "SERVICE", "MERCHANDISE", "ENTERTAINER_MUSIC", "ENTERTAINER_NON_MUSIC"],
        { message: "Category is required." }),
    contactId: z.coerce.number().min(1, { message: "Contact is required!" }),
    agentId: z.coerce.number().min(1, { message: "Agent is required!" }),
})

export type ProductSchema = z.infer<typeof productSchema>

export const reportSchema = z.object({
    id: z.coerce.number().optional(),
    name: z
        .string()
        .min(1, { message: "Name is required." }),
})

export type ReportSchema = z.infer<typeof reportSchema>

export const taskSchema = z.object({
    id: z.coerce.number().optional(),
    note: z
        .string()
        .min(1, { message: "Name is required." }),
    agentId: z.coerce.number().min(1, { message: "Agent is required!" }),
})

export type TaskSchema = z.infer<typeof taskSchema>