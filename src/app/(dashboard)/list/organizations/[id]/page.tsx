import Link from "next/link"
import Image from "next/image"
import prisma from "@/lib/prisma"
import { Organization, Event, Product } from "@/generated/prisma"
import { notFound } from "next/navigation"
import FormContainer from "@/components/FormContainer"
import { formatDate, getAgentName, getContactEmail, getContactName, getContactNumber } from "@/lib/utils"
import Table from "@/components/Table"

const SingleOrganizationPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const { id } = await params;

    const organization = await prisma.organization.findUnique({
        where: { id: id },
        include: {
            users: true,
            events: {
                include: {
                    products: true
                }
            },
            tasks: true,
        }
    })

    if (!organization) {
        return notFound();
    }

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                {/* TOP */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* USER INFO CARD */}
                    <div className="bg-lightorange py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="flex flex-1 flex-col justify-between gap-4">
                            <div className='flex justify-between items-center'>
                                <span className="font-bold">Organization Details</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold">{organization.name}</h1>
                                <FormContainer table="organizations"
                                    type="update"
                                    data={organization}
                                />
                            </div>
                            <p className="text-sm">
                                {organization.note || "No description available."}
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/company.png" alt="" width={14} height={14} />
                                    <span>Contact: {getContactName(organization.contactId)}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/agent.png" alt="" width={14} height={14} />
                                    <span>Agent: {getAgentName(organization.agentId)}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/mail.png" alt="" width={14} height={14} />
                                    <span>{getContactEmail(organization.contactId)}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/phone.png" alt="" width={14} height={14} />
                                    <span>{getContactNumber(organization.contactId)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {/* BOTTOM */}
                <div className="mt-4 bg-white rounded-md p-4">

                    {/* CONTACTS TABLE */}
                    <div className="mb-8">
                        <h1 className="text-xl font-semibold mb-4">Contacts</h1>
                        {organization.users.length > 0 ? (
                            <Table
                                columns={[
                                    { header: "Name", accessor: "name" },
                                    { header: "Email", accessor: "email" },
                                    { header: "Phone", accessor: "phone" },
                                ]}
                                renderRow={(contact: typeof organization.users[number]) => (
                                    <tr key={contact.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightpurple">
                                        <td className="py-4">
                                            <Link href={`/list/events/${contact.id}`} className="font-medium hover:underline">
                                                {contact.firstName} {contact.lastName}
                                            </Link>
                                        </td>
                                        <td className="py-4">{contact.email}</td>
                                        <td className="py-4">{contact.phone}</td>
                                    </tr>
                                )}
                                data={organization.users}
                            />
                        ) : (
                            <p className="text-gray-500 text-sm">No contacts found for this organization.</p>
                        )}
                    </div>

                    {/* TASKS TABLE */}
                    <div className="mb-8">
                        <h1 className="text-xl font-semibold mb-4">Tasks</h1>
                        {organization.tasks.length > 0 ? (
                            <Table
                                columns={[
                                    { header: "Task", accessor: "task" },
                                    { header: "Agent", accessor: "agent" },
                                    { header: "Complete?", accessor: "complete" },
                                ]}
                                renderRow={(task: typeof organization.tasks[number]) => (
                                    <tr key={task.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightpurple">
                                        <td className="py-4">{task.note}</td>
                                        <td className="py-4">{getAgentName(task.ownerId)}</td>
                                        <td className="py-4">{task.complete ? "Yes" : "No"}</td>
                                    </tr>
                                )}
                                data={organization.tasks}
                            />
                        ) : (
                            <p className="text-gray-500 text-sm">No tasks found for this organization.</p>
                        )}
                    </div>

                    {/* LOG TABLE */}
                    <div className="mb-8">
                        <h1 className="text-xl font-semibold mb-4">Log</h1>
                        <p className="text-gray-500 text-sm">No results returned.</p>
                    </div>

                    {/* EVENTS TABLE */}
                    <div className="mb-8">
                        <h1 className="text-xl font-semibold mb-4">Events</h1>
                        {organization.events.length > 0 ? (
                            <Table
                                columns={[
                                    { header: "Event Name", accessor: "name" },
                                    { header: "Start Date", accessor: "startDate" },
                                    { header: "End Date", accessor: "endDate" },
                                    { header: "Budget", accessor: "budget" },
                                ]}
                                renderRow={(event: typeof organization.events[number]) => (
                                    <tr key={event.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightpurple">
                                        <td className="py-4">
                                            <Link href={`/list/events/${event.id}`} className="font-medium hover:underline">
                                                {event.name}
                                            </Link>
                                        </td>
                                        <td>{formatDate(event.startDate)}</td>
                                        <td>{formatDate(event.endDate)}</td>
                                        <td>{event.budget ? `$${event.budget.toFixed(2)}` : "N/A"}</td>
                                    </tr>
                                )}
                                data={organization.events}
                            />
                        ) : (
                            <p className="text-gray-500 text-sm">No events found for this organization.</p>
                        )}
                    </div>

                    {/* EVENT PRODUCTS TABLE */}
                    <div className="mb-8">
                        <h1 className="text-xl font-semibold mb-4">Products Pitched</h1>
                        <p className="text-gray-500 text-sm">No results returned.</p>
                    </div>

                    {/* DOCUMENTS TABLE */}
                    <div className="mb-8">
                        <h1 className="text-xl font-semibold mb-4">Documents</h1>
                        <p className="text-gray-500 text-sm">No results returned.</p>
                    </div>

                </div>
            </div>
         
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Table Links</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs font-medium">
                        <Link className="p-3 rounded-md bg-orange" href="/">
                            Organization&apos;s Contacts
                        </Link>
                        <Link className="p-3 rounded-md bg-lightorange" href="/">
                            Contact&apos;s Tasks
                        </Link>
                        <Link className="p-3 rounded-md bg-orange" href="/">
                            Contact&apos;s Events
                        </Link>
                        <Link className="p-3 rounded-md bg-lightorange" href="/">
                            Contact&apos;s Pitched Products
                        </Link>
                        <Link className="p-3 rounded-md bg-orange" href="/">
                            Contact&apos;s Documents
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleOrganizationPage