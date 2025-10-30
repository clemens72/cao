import prisma from "@/lib/prisma";
import FormModel from "./FormModel";

export type FormContainerProps = {
    table:
    | "contacts"
    | "events"
    | "tasks"
    | "products"
    | "organizations"
    | "reports";
    type: "create" | "update" | "delete";
    data?: any;
    id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
    let relatedData = {};

    if (type !== "delete") {
        switch (table) {

            case "contacts":
                const contactAgents = await prisma.agent.findMany({
                    select: { id: true, fname: true, lname: true },
                });
                relatedData = { agents: contactAgents }
                break;

            case "events":
                const eventContacts = await prisma.contact.findMany({
                    select: { id: true, fname: true, lname: true },
                });
                const eventAgents = await prisma.agent.findMany({
                    select: { id: true, fname: true, lname: true },
                });
                relatedData = { contacts: eventContacts, agents: eventAgents }
                break;

            case "organizations":
                const organizationContacts = await prisma.contact.findMany({
                    select: { id: true, fname: true, lname: true },
                });
                const organizationAgents = await prisma.agent.findMany({
                    select: { id: true, fname: true, lname: true },
                });
                relatedData = { contacts: organizationContacts, agents: organizationAgents }
                break;

            case "products":
                const productContacts = await prisma.contact.findMany({
                    select: { id: true, fname: true, lname: true },
                });
                const productAgents = await prisma.agent.findMany({
                    select: { id: true, fname: true, lname: true },
                });
                relatedData = { contacts: productContacts, agents: productAgents }
                break;

            case "tasks":
                const taskAgents = await prisma.agent.findMany({
                    select: { id: true, fname: true, lname: true },
                });
                relatedData = { agents: taskAgents }
                break;

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