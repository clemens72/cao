import prisma from "@/lib/prisma"
import FormContainer from "@/components/FormContainer"
import { formatDate, getOrganiationName, getPersonName, getProductName, getProductStatus } from "@/lib/utils"
import Table from "@/components/Table"
import { EventProduct } from "@/generated/prisma"
import Link from "next/link"

const SingleEventPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const { id } = await params;

    const entity = await prisma.entity.findUnique({
        where: { id: id },
    })
    const event = await prisma.event.findUnique({
        where: { entityId: id },
    })
    if (!event) {
        return <div>Event not found.</div>;
    }
    const eventType = await prisma.eventType.findUnique({
        where: { id: event.eventTypeId || "" },
    })
    const eventStatus = await prisma.eventStatus.findUnique({
        where: { id: event.eventStatusId || "" },
    })

    const client = await prisma.person.findUnique({
        where: { entityId: event.clientPersonEntityId || "" },
    })
    const venue = await prisma.organization.findUnique({
        where: { entityId: event.venueOrganizationEntityId || "" },
    })
    const billingContact = await prisma.person.findUnique({
        where: { entityId: event.billingContactPersonEntityId || "" },
    })
    const agent = await prisma.person.findUnique({
        where: { entityId: event.agentPersonEntityId || "" },
    })
    const contacts = await prisma.eventPerson.findMany({
        where: { eventEntityId: id },
    })
    const eventProducts = await prisma.eventProduct.findMany({
        where: { eventEntityId: id },
    })

    const data = {
        entityId: id,
        event,
        eventType,
        eventStatus,
        client,
        venue,
        billingContact,
        agent,
        contacts,
    }

    const renderProducts = (item: EventProduct) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightorange"
        >
            <td className="font-semibold pl-2">
                <Link href={`/list/products/${item.productEntityId}`}>
                    {getProductName(item.productEntityId)}
                </Link>
            </td>
            <td className="hidden md:table-cell">{getProductStatus(item.productStatusId) || "N/A"}</td>
            <td className="hidden md:table-cell">{formatDate(item.startDate)}</td>
            <td className="hidden md:table-cell">{formatDate(item.endDate)}</td>
            <td className="hidden md:table-cell">{getOrganiationName(item.venueOrganizationEntityId) || "N/A"}</td>
            <td className="hidden md:table-cell">${item.grossPrice || "$0.00"}.00</td>
            <td className="hidden md:table-cell">{item.feePercent ? `${item.feePercent}%` : "0%"}</td>
            <td className="hidden md:table-cell">${item.deposit || "$0.00"}0</td>
        </tr>
    )

    return (
        <div className="flex-1 p-4 flex flex-col gap-4">
            <div className="flex flex-col xl:flex-row gap-4">
                {/* TOP SECTION - EVENT DETAILS */}
                <div className="w-full xl:w-2/3 bg-white p-6 rounded-md shadow">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">{event.name}</h1>
                        <FormContainer table="events" type="update" data={data} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            {/* Client */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Client</h3>
                                <p className="text-sm">{client?.firstName} {client?.lastName}</p>
                            </div>

                            {/* Venue */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Venue</h3>
                                <p className="text-sm">{venue?.name}</p>
                            </div>

                            {/* Location */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Location</h3>
                                <p className="text-sm">{event.location}</p>
                            </div>

                            {/* Start Date */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Start Date</h3>
                                <p className="text-sm">{formatDate(event.startDate)}</p>
                            </div>

                            {/* End Date */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">End Date</h3>
                                <p className="text-sm">{formatDate(event.endDate)}</p>
                            </div>

                            {/* Event Type */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Event Type</h3>
                                <p className="text-sm">{eventType?.description}</p>
                            </div>

                            {/* Billing Contact */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Billing Contact</h3>
                                {billingContact ? (
                                    <p className="text-sm">{billingContact.firstName} {billingContact.lastName}</p>
                                ) : (
                                    <p className="text-sm text-red-400">No billing contact assigned</p>
                                )}
                            </div>

                            {/* Contacts */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Contacts</h3>
                                <div className="text-sm space-y-1">
                                    {contacts.length > 0 ? (
                                        contacts.map((contact) => (
                                            <p key={contact.id}>{getPersonName(contact.personEntityId)}</p>
                                        ))
                                    ) : (
                                        <p className="text-sm text-red-400">No contacts assigned</p>
                                    )}
                                </div>
                            </div>

                            {/* Budget */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Budget</h3>
                                <p className="text-sm">{event.budget}</p>
                            </div>

                            {/* Created Date */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Created Date</h3>
                                <p className="text-sm">{formatDate(entity?.createDate)}</p>
                            </div>

                            {/* Agent */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Agent</h3>
                                {agent ? (
                                    <p className="text-sm">{agent.firstName} {agent.lastName}</p>
                                ) : (
                                    <p className="text-sm text-red-400">No agent assigned</p>
                                )}
                            </div>

                            {/* Note */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Note</h3>
                                <p className="text-sm whitespace-pre-wrap">{event.note || "No notes available"}</p>
                            </div>

                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            {/* Event Status */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Event Status</h3>
                                <p className="text-sm">{eventStatus?.description}</p>
                            </div>

                            {/* Contract Sent Date */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Contract Sent Date</h3>
                                <p className="text-sm">{formatDate(event.contractSentDate)}</p>
                            </div>

                            {/* Contract Returned Date */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Contract Returned Date</h3>
                                <p className="text-sm">{formatDate(event.contractReturnedDate)}</p>
                            </div>

                            {/* Event Form */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Event Form</h3>
                                <p className="text-sm">{event.eventForm}</p>
                            </div>

                            {/* Attendance */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Attendance</h3>
                                <p className="text-sm">{event.attendance}</p>
                            </div>

                            {/* Guest Arrival Time */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Guest Arrival Time</h3>
                                <p className="text-sm">{event.guestArrivalTime}</p>
                            </div>

                            {/* Report To */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Report To</h3>
                                <p className="text-sm">{event.reportTo}</p>
                            </div>

                            {/* Break Area */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Break Area</h3>
                                <p className="text-sm">{ }</p>
                            </div>

                            {/* Equipment Storage */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Equipment Storage</h3>
                                <p className="text-sm">{ }</p>
                            </div>

                            {/* Total Deposit */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 border-t pt-4 border-black">
                                <h3 className="text-lg font-semibold text-gray-600 mb-1">Total Deposit</h3>
                                <p className="text-lg">$1000.00</p>
                            </div>

                        </div>
                    </div>
                </div>
                {/* RIGHT SECTION - FINANCIAL DETAILS */}
                <div className="w-full xl:w-1/3 flex flex-col gap-4">
                    <div className="bg-white p-6 rounded-md shadow">
                        <h1 className="text-xl font-bold text-gray-800 mb-6">Financial Details</h1>

                        <div className="space-y-6 text-center">
                            {/* Row 1 - COGS */}
                            <div className="pb-4 border-b border-gray-200">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">COGS</p>
                                        <p className="text-base font-semibold text-gray-800">$0.00</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Paid</p>
                                        <p className="text-base font-semibold text-gray-800">$0.00</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Balance</p>
                                        <p className="text-base font-semibold text-red-600">$0.00</p>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2 - Booking Fees */}
                            <div className="pb-4 border-b border-gray-200">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Booking Fees</p>
                                        <p className="text-base font-semibold text-gray-800">$0.00</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Recorded</p>
                                        <p className="text-base font-semibold text-gray-800">$0.00</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Balance</p>
                                        <p className="text-base font-semibold text-red-600">$0.00</p>
                                    </div>
                                </div>
                            </div>

                            {/* Row 3 - Totals */}
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-1">EVENT COST</p>
                                        <p className="text-lg font-bold text-gray-900">$0.00</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-1">RECEIVED</p>
                                        <p className="text-lg font-bold text-green-600">$0.00</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-1">BALANCE</p>
                                        <p className="text-lg font-bold text-red-600">$0.00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-md shadow">
                        <div className="justify-between items-center mb-6 flex">
                            <h1 className="text-xl font-bold text-gray-800 mb-6">Tasks</h1>
                            <FormContainer table="tasks" type="create" data={{ eventEntityId: id }} />
                        </div>
                        <Table columns={[
                            { header: "Owner", accessor: "owner" },
                            { header: "Date", accessor: "date" },
                            { header: "Note", accessor: "note" },
                            { header: "Modified Date", accessor: "modifiedDate" }
                        ]} renderRow={() => null} data={[]} />
                    </div>

                    <div className="bg-white p-6 rounded-md shadow">
                        <div className="justify-between items-center mb-6 flex">
                            <h1 className="text-xl font-bold text-gray-800 mb-6">Log</h1>
                            <FormContainer table="tasks" type="create" data={{ eventEntityId: id }} />
                        </div>
                        
                        <Table columns={[
                            { header: "Owner", accessor: "owner" },
                            { header: "Date", accessor: "date" },
                            { header: "Note", accessor: "note" },
                            { header: "Date", accessor: "Date" }
                        ]} renderRow={() => null} data={[]} />
                    </div>
                </div>
            </div>

                {/* BOTTOM SECTION - PRODUCTS, PAYMENTS & DOCUMENTS */}
                <div className="bg-white p-6 rounded-md shadow">
                    <div className="justify-between items-center mb-6 flex">
                        <h1 className="text-xl font-bold text-gray-800 mb-6">Products</h1>
                        <FormContainer table="eventProducts" type="create" data={{ eventEntityId: id }} />
                    </div>
                    <Table columns={[
                        { header: "Product Name", accessor: "productName" },
                        { header: "Status", accessor: "status" },
                        { header: "Start Time", accessor: "startTime" },
                        { header: "End Time", accessor: "endTime" },
                        { header: "Venue", accessor: "venue" },
                        { header: "Product Fee", accessor: "productFee" },
                        { header: "Booking Fee", accessor: "bookingFee" },
                        { header: "Total Balance Due", accessor: "totalBalanceDue" },
                    ]}
                        renderRow={renderProducts} data={eventProducts} />
                </div>
                <div className="bg-white p-6 rounded-md shadow">
                    <div className="justify-between items-center mb-6 flex">
                        <h1 className="text-xl font-bold text-gray-800 mb-6">Payments</h1>
                        <FormContainer table="tasks" type="create" data={{ eventEntityId: id }} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-md shadow">
                    <div className="justify-between items-center mb-6 flex">
                        <h1 className="text-xl font-bold text-gray-800 mb-6">Documents</h1>
                        <FormContainer table="tasks" type="create" data={{ eventEntityId: id }} />
                    </div>
                </div>
            </div>
            )
}

            export default SingleEventPage