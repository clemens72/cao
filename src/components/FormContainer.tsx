import prisma from "@/lib/prisma";
import FormModel from "./FormModel";

export type FormContainerProps = {
    table:
    | "contacts"
    | "events"
    | "tasks"
    | "products"
    | "entertainers"
    | "organizations"
    | "eventProducts"
    | "organizationPersons"
    // | "clientProductPitches"
    // | "documents"
    // | "payments"
    // | "reports";
    type: "create" | "update" | "delete";
    data?: any;
    id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
    let relatedData = {};

    if (type !== "delete") {
        switch (table) {

            case "organizations":
                const orgStates = await prisma.state.findMany({
                    select: { id: true, code: true, description: true },
                    orderBy: { description: 'asc' }
                });
                const orgCountries = await prisma.country.findMany({
                    select: { id: true, code: true, description: true },
                    orderBy: { description: 'asc' }
                });
                const orgPhoneTypes = await prisma.phoneType.findMany({
                    select: { id: true, description: true },
                    orderBy: { description: 'asc' }
                });
                const organizationTypes = await prisma.organizationType.findMany({
                    select: { id: true, description: true },
                    orderBy: { description: 'asc' }
                });
                const orgElectronicAddressTypes = await prisma.electronicAddressType.findMany({
                    select: { id: true, description: true },
                    orderBy: { description: 'asc' }
                });
                const orgAgents = await prisma.person.findMany({
                    where: {
                        role: { 
                            description: { equals: "Agent" }
                        }
                    },
                    select: { entityId: true, firstName: true, lastName: true },
                    orderBy: { lastName: 'asc' }
                });
                const dynamicLists = await prisma.dynamicList.findMany({
                    select: { id: true, name: true, description: true },
                    orderBy: { name: 'asc' }
                });
                relatedData = {
                    states: orgStates,
                    countries: orgCountries,
                    phoneTypes: orgPhoneTypes,
                    organizationTypes,
                    agents: orgAgents,
                    electronicAddressTypes: orgElectronicAddressTypes,
                    dynamicLists
                };

                break;

             case "contacts":
                const contactStates = await prisma.state.findMany({
                    select: { id: true, code: true, description: true },
                    orderBy: { description: 'asc' }
                });
                const contactCountries = await prisma.country.findMany({
                    select: { id: true, code: true, description: true },
                    orderBy: { description: 'asc' }
                });
                const contactPhoneTypes = await prisma.phoneType.findMany({
                    select: { id: true, description: true },
                    orderBy: { description: 'asc' }
                });
                const contactAgents = await prisma.person.findMany({
                    where: {
                        role: { 
                            description: { equals: "Agent" }
                        }
                    },
                    select: { entityId: true, firstName: true, lastName: true },
                    orderBy: { lastName: 'asc' }
                });
                relatedData = {
                    states: contactStates,
                    countries:contactCountries,
                    phoneTypes: contactPhoneTypes,
                    agents: contactAgents
                };
                break;

            case "events":
                const eventContacts = await prisma.person.findMany({
                    select: { entityId: true, firstName: true, lastName: true },
                    orderBy: { lastName: 'asc' }
                });
                const venues = await prisma.organization.findMany({
                    select: { entityId: true, name: true },
                    orderBy: { name: 'asc' }
                });
                const eventTypes = await prisma.eventType.findMany({
                    select: { id: true, description: true },
                    orderBy: { description: 'asc' }
                });
                const eventStatuses = await prisma.eventStatus.findMany({
                    select: { id: true, description: true },
                    orderBy: { description: 'asc' }
                });
                const eventAgents = await prisma.person.findMany({
                    where: {
                        role: { 
                            description: { equals: "Agent" }
                        }
                    },
                    select: { entityId: true, firstName: true, lastName: true },
                    orderBy: { lastName: 'asc' }
                });
                relatedData = {
                    contacts: eventContacts,
                    agents: eventAgents,
                    eventTypes: eventTypes,
                    eventStatuses: eventStatuses,
                    venues: venues
                }
                break;

            case "products":
                const productContacts = await prisma.person.findMany({
                    select: { entityId: true, firstName: true, lastName: true },
                    orderBy: { lastName: 'asc' }
                });
                const productElectronicAddressTypes = await prisma.electronicAddressType.findMany({
                    select: { id: true, description: true },
                    orderBy: { description: 'asc' }
                });
                relatedData = {
                    contacts: productContacts,
                    electronicAddressTypes:
                    productElectronicAddressTypes
                }
                break;

            case "entertainers":
                const entertainerContacts = await prisma.person.findMany({
                    select: { entityId: true, firstName: true, lastName: true },
                    orderBy: { lastName: 'asc' }
                });
                const entertainerAgents = await prisma.person.findMany({
                    where: {
                        role: { 
                            description: { equals: "Agent" }
                        }
                    },
                    select: { entityId: true, firstName: true, lastName: true },
                    orderBy: { lastName: 'asc' }
                });
                const entertainerElectronicAddressTypes = await prisma.electronicAddressType.findMany({
                    select: { id: true, description: true },
                    orderBy: { description: 'asc' }
                });
                relatedData = {
                    contacts: entertainerContacts,
                    agents: entertainerAgents,
                    electronicAddressTypes: entertainerElectronicAddressTypes
                }
                break;

            case "eventProducts":
                break;

            case "organizationPersons":
                break;

            /*case "tasks":
                const taskAgents = await prisma.user.findMany({
                    where: {
                        roles: {
                            some: {
                                name: "agent"
                            }
                        }
                    },
                    select: { id: true, firstName: true, lastName: true },
                });
                relatedData = { agents: taskAgents }
                break; */

            default:
                break;
        }
    }

    return (
        <div className="">
            <FormModel
                table={table}
                type={type}
                data={data}
                id={id}
                relatedData={relatedData}
            />
        </div>
    );
};

export default FormContainer;