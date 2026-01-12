import prisma from "@/lib/prisma"
import FormContainer from "@/components/FormContainer"
import { formatDate, getOrganizationName, getPersonName, getProductName, getProductStatus } from "@/lib/utils"
import Table from "@/components/Table"
import PaginatedTable from "@/components/PaginatedTable"
import { EventProduct } from "@/generated/prisma"

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

    const clientPerson = await prisma.person.findUnique({
        where: { entityId: event.clientPersonEntityId || "" },
    })
    const clientOrg = await prisma.organization.findUnique({
        where: { entityId: event.clientOrganizationEntityId || "" },
    })

    const venuePerson = await prisma.person.findUnique({
        where: { entityId: event.venuePersonEntityId || "" },
    })
    const venueOrganization = await prisma.organization.findUnique({
        where: { entityId: event.venueOrganizationEntityId || "" },
    })

    const billingContactPerson = await prisma.person.findUnique({
        where: { entityId: event.billingContactPersonEntityId || "" },
    })
    const billingContactOrg = await prisma.organization.findUnique({
        where: { entityId: event.billingContactOrganizationEntityId || "" },
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

    const eventCost = (eventProducts.reduce((sum, ep) => sum + (parseInt(ep.grossPrice ?? '0') || 0), 0)).toFixed(2);
    const COGS = (eventProducts.reduce((sum, ep) => sum + ((parseInt(ep.grossPrice ?? '0') || 0) * (100 - parseFloat(ep.feePercent ?? '0') || 0) / 100), 0)).toFixed(2);
    const bookingFees = (eventProducts.reduce((sum, ep) => sum + ((parseInt(ep.grossPrice ?? '0') || 0) * (parseFloat(ep.feePercent ?? '0') || 0) / 100), 0)).toFixed(2);

    const data = {
        entityId: id,
        event,
        eventType,
        eventStatus,
        clientPerson,
        clientOrg,
        venueOrganization,
        venuePerson,
        billingContactPerson,
        billingContactOrg,
        agent,
        contacts,
    }

    const renderProducts = (item: EventProduct) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightorange"
        >
            <td className="font-semibold pl-2">{getProductName(item.productEntityId)}</td>
            <td className="hidden md:table-cell">{getProductStatus(item.productStatusId) || "N/A"}</td>
            <td className="hidden md:table-cell">{formatDate(item.startDate)}</td>
            <td className="hidden md:table-cell">{formatDate(item.endDate)}</td>
            <td className="hidden md:table-cell">{getOrganizationName(item.venueOrganizationEntityId) || "N/A"}</td>
            <td className="hidden md:table-cell">${((parseInt(item.grossPrice ?? '0') || 0) * (100 - parseFloat(item.feePercent ?? '0') || 0) / 100).toFixed(2)}</td>
            <td className="hidden md:table-cell">${((parseInt(item.grossPrice ?? '0') || 0) * (parseFloat(item.feePercent ?? '0') || 0) / 100).toFixed(2)}</td>
            <td className="hidden md:table-cell">$TBD</td>
            <td className="hidden md:table-cell"><FormContainer table="eventProducts" type="update" data={item} /></td>
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
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Client</h3>
                                <p className="text-sm md:col-span-2">
                                    <a href={`/list/organizations/${clientOrg?.entityId}`}>{clientOrg ? clientOrg.name : ""}</a> {clientOrg ? `- ` : ""}
                                    <a href={`/list/contacts/${clientPerson?.entityId}`}>{clientPerson ? `${clientPerson.firstName} ${clientPerson.lastName}` : ""}</a>
                                </p>
                            </div>

                            {/* Venue */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Venue</h3>
                                <p className="text-sm md:col-span-2">
                                    <a href={`/list/organizations/${venueOrganization?.entityId}`}>{venueOrganization ? venueOrganization.name : ""}</a> {venueOrganization ? `- ` : ""}
                                    <a href={`/list/contacts/${venuePerson?.entityId}`}>{venuePerson ? `${venuePerson.firstName} ${venuePerson.lastName}` : ""}</a>
                                </p>
                            </div>

                            {/* Location */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Location</h3>
                                <p className="text-sm md:col-span-2">{event.location}</p>
                            </div>

                            {/* Start Date */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Start Date</h3>
                                <p className="text-sm md:col-span-2">{formatDate(event.startDate)}</p>
                            </div>

                            {/* End Date */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">End Date</h3>
                                <p className="text-sm md:col-span-2">{formatDate(event.endDate)}</p>
                            </div>

                            {/* Event Type */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Event Type</h3>
                                <p className="text-sm md:col-span-2">{eventType?.description}</p>
                            </div>

                            {/* Billing Contact */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Billing Contact</h3>
                                <p className="text-sm md:col-span-2">
                                    <a href={`/list/organizations/${billingContactOrg?.entityId}`}>{billingContactOrg ? billingContactOrg.name : ""}</a> {billingContactOrg ? `- ` : ""}
                                    <a href={`/list/contacts/${billingContactPerson?.entityId}`}>{billingContactPerson ? `${billingContactPerson.firstName} ${billingContactPerson.lastName}` : ""}</a>
                                </p>
                            </div>

                            {/* Contacts */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Contacts</h3>
                                <div className="text-sm space-y-1 md:col-span-2">
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
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Budget</h3>
                                <p className="text-sm md:col-span-2">{event.budget}</p>
                            </div>

                            {/* Created Date */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Created Date</h3>
                                <p className="text-sm md:col-span-2">{formatDate(entity?.createDate)}</p>
                            </div>

                            {/* Agent */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Agent</h3>
                                {agent ? (
                                    <p className="text-sm md:col-span-2">{agent.firstName} {agent.lastName}</p>
                                ) : (
                                    <p className="text-sm md:col-span-2 text-red-400">No agent assigned</p>
                                )}
                            </div>

                            {/* Note */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Note</h3>
                                <p className="text-sm md:col-span-2 whitespace-pre-wrap">{event.note || "No notes available"}</p>
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
                                <p className="text-lg">${(parseInt(eventCost)/2).toFixed(2)}</p>
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
                                        <p className="text-base font-semibold text-gray-800">${COGS}</p>
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
                                        <p className="text-base font-semibold text-gray-800">${bookingFees}</p>
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
                                        <p className="text-lg font-bold text-gray-900">${eventCost}</p>
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
                    <PaginatedTable 
                        columns={[
                            { header: "Product Name", accessor: "productName" },
                            { header: "Status", accessor: "status" },
                            { header: "Start Time", accessor: "startTime" },
                            { header: "End Time", accessor: "endTime" },
                            { header: "Venue", accessor: "venue" },
                            { header: "Product Fee", accessor: "productFee" },
                            { header: "Booking Fee", accessor: "bookingFee" },
                            { header: "Total Balance Due", accessor: "totalBalanceDue" },
                        ]}
                        rows={eventProducts.map((item) => renderProducts(item))} 
                        totalCount={eventProducts.length}
                        itemsPerPage={10} 
                    />
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