import prisma from "@/lib/prisma"
import FormContainer from "@/components/FormContainer"
import { formatDate, getElectronicAddressType, getEventName, getEventPrice, getEventStatus, getOrganizationName, getPersonName, getPhoneType, getProductName, getProductStatus } from "@/lib/utils";
import Table from "@/components/Table";
import PaginatedTable from "@/components/PaginatedTable";
import { Event, EventProduct, OrganizationPerson } from "@/generated/prisma";
import Link from "next/link";

const SingleContactPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const { id } = await params;

    const person = await prisma.person.findUnique({
        where: { entityId: id },
    })
    if (!person) {
        return <div>Contact not found.</div>;
    }
    const user = await prisma.user.findUnique({
        where: { personEntityId: id },
    })
    const role = await prisma.role.findUnique({
        where: { id: user?.roleId || "" },
    })
    const agent = await prisma.person.findUnique({
        where: { entityId: person?.agentPersonEntityId || "" },
    })

    const address = await prisma.address.findFirst({
        where: { entityId: id || "" },
    });
    const country = await prisma.country.findUnique({
        where: { id: address?.countryId || "" },
    });
    const state = await prisma.state.findUnique({
        where: { id: address?.stateId || "" },
    });

    const phone = await prisma.phone.findMany({
        where: { entityId: id },
    });
    const electronicAddress = await prisma.electronicAddress.findMany({
        where: { entityId: id },
    });

    const contactOrganizations = await prisma.organizationPerson.findMany({
        where: { personEntityId: id },
    });

    const contactEvents = await prisma.event.findMany({
        where: { clientPersonEntityId: id },
        orderBy: {
            startDate: 'desc'
        }
    });

    const contactPitchedProducts = await prisma.eventProduct.findMany({
        where: {
            eventEntityId: {
                in: contactEvents.map(e => e.entityId)
            }
        },
        orderBy: {
            startDate: 'desc'
        }
    });

    const data = {
        entityId: person.entityId,
        person: person,
        address: address,
        state: state,
        country: country,
        phones: phone,
        electronicAddress: electronicAddress,
        agent: agent,
        role: role,
    }

    const renderOrganizations = (item: OrganizationPerson) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightorange"
        >
            <td className="font-semibold pl-2">
                <Link
                    href={`/list/organizations/${item.organizationEntityId}`}>
                    {getOrganizationName(item.organizationEntityId)}
                </Link>
            </td>
            <td className="hidden md:table-cell">{item.isPrimary ? "Yes" : "No"}</td>
            <td className="hidden md:table-cell">{formatDate(item.effectiveDate)}</td>
            <td className="hidden md:table-cell">{formatDate(item.expirationDate)}</td>
            <td className="hidden md:table-cell"><FormContainer table="organizationPersons" type="update" data={item} /></td>
        </tr>
    )

    const renderEvents = (item: Event) => (
        <tr
            key={item.entityId}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightorange"
        >
            <td className="font-semibold pl-2">
                <Link
                    href={`/list/events/${item.entityId}`}>
                    {item.name}
                </Link>
                </td>
            <td className="hidden md:table-cell">{formatDate(item.startDate)}</td>
            <td className="hidden md:table-cell">ERROR</td>
            <td className="hidden md:table-cell">{getEventStatus(item.eventStatusId)}</td>
            <td className="hidden md:table-cell">{formatDate(item.contractReturnedDate)}</td>
            <td className="hidden md:table-cell">${getEventPrice(item.entityId)}.00</td>
        </tr>
    )

    const renderPitchedProducts = (item: EventProduct) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightorange"
        >
            <td className="font-semibold pl-2">
                <Link
                    href={`/list/events/${item.eventEntityId}`}>
                    {getProductName(item.productEntityId)}
                </Link>
                </td>
            <td className="hidden md:table-cell">{formatDate(item.startDate)}</td>
            <td className="hidden md:table-cell">{getProductStatus(item.productStatusId)}</td>
            <td className="hidden md:table-cell">${item.grossPrice}.00</td>
            <td className="hidden md:table-cell">for {getEventName(item.eventEntityId)}</td>
            <td className="hidden md:table-cell">{getPersonName(item.createdByPersonEntityId)}</td>
        </tr>
    )

    return (
        <div className="flex-1 p-4 flex flex-col gap-4">
            <div className="flex flex-col xl:flex-row gap-4">
                {/* TOP SECTION - CONTACT DETAILS */}
                <div className="w-full xl:w-2/3 bg-white p-6 rounded-md shadow">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">{person.firstName} {person.lastName}</h1>
                        <FormContainer table="contacts" type="update" data={data} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-8">
                            {/* Address */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Address</h3>
                                {address ? (
                                    <p className="text-sm">
                                        {address.address1}, {address.address2}
                                        <br />
                                        {address.city}, {state?.code} {address.zip} {address.zipExtension}
                                        <br />
                                        {country?.description}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-400">No address available</p>
                                )}
                            </div>

                            {/* Phone Numbers */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Phone Numbers</h3>
                                {phone.length > 0 ? (
                                    <div className="space-y-1">
                                        {phone.map((p) => (
                                            <p key={p.id} className="text-sm">
                                                {p.phoneNumber} [{getPhoneType(p.phoneTypeId)}]
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">No phone numbers available</p>
                                )}
                            </div>

                            {/* Electronic Addresses */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Electronic Addresses</h3>
                                {electronicAddress.length > 0 ? (
                                    <div className="space-y-1">
                                        {electronicAddress.map((ea) => (
                                            <p key={ea.id} className="text-sm">
                                                {ea.electronicAddress} [{getElectronicAddressType(ea.electronicAddressTypeId)}]
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">No electronic addresses available</p>
                                )}
                            </div>

                            {/* Role */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Role</h3>
                                <p className="text-sm">{role?.description || "No role available"}</p>
                            </div>


                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Note */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Note</h3>
                                <p className="text-sm whitespace-pre-wrap">{person.note || "No notes available"}</p>
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

                            {/* Referred By */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Referred By</h3>
                                <p className="text-sm">{person.referredBy || ""}</p>
                            </div>


                            {/* Job Title */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Job Title</h3>
                                <p className="text-sm">{person.jobTitle || "No title specified"}</p>
                            </div>

                            {/* List Membership */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">List Membership</h3>
                                <p className="text-sm">{"None"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION - TASKS & LOG */}
                <div className="w-full xl:w-1/3 flex flex-col gap-4">
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

            {/* BOTTOM SECTION - ORGANIZATIONS, EVENTS, PITCHED PRODUCTS & DOCUMENTS */}
            <div className="bg-white p-6 rounded-md shadow">
                <div className="justify-between items-center mb-6 flex">
                    <h1 className="text-xl font-bold text-gray-800 mb-6">Organization Affiliation</h1>
                    <FormContainer table="organizationPersons" type="create" data={{ eventEntityId: id }} />
                </div>
                <PaginatedTable 
                    columns={[
                        { header: "Name", accessor: "name" },
                        { header: "Primary Contact", accessor: "isPrimary" },
                        { header: "Effective Date", accessor: "effectiveDate" },
                        { header: "Expiration Date", accessor: "expirationDate" }
                    ]} 
                    rows={contactOrganizations.map((item) => renderOrganizations(item))} 
                    totalCount={contactOrganizations.length}
                    itemsPerPage={10} 
                />
            </div>

            <div className="bg-white p-6 rounded-md shadow">
                <div className="justify-between items-center mb-6 flex">
                    <h1 className="text-xl font-bold text-gray-800 mb-6">Events</h1>
                </div>
                <PaginatedTable 
                    columns={[
                        { header: "Name", accessor: "Name" },
                        { header: "Date", accessor: "date" },
                        { header: "Association", accessor: "association" },
                        { header: "Status", accessor: "status" },
                        { header: "Event Cost", accessor: "eventCost" }
                    ]} 
                    rows={contactEvents.map((item) => renderEvents(item))} 
                    totalCount={contactEvents.length}
                    itemsPerPage={10} 
                />
            </div>

            <div className="bg-white p-6 rounded-md shadow">
                <div className="justify-between items-center mb-6 flex">
                    <h1 className="text-xl font-bold text-gray-800 mb-6">Pitched Products</h1>
                    {/* <FormContainer table="clientProductPitches" type="create" data={{ eventEntityId: id }} /> */}
                </div>
                <PaginatedTable 
                    columns={[
                        { header: "Product", accessor: "product" },
                        { header: "Date", accessor: "date" },
                        { header: "Status", accessor: "Status" },
                        { header: "Price", accessor: "Price" },
                        { header: "Note", accessor: "note" },
                        { header: "Pitched By", accessor: "pitchedBy" }
                    ]} 
                    rows={contactPitchedProducts.map((item) => renderPitchedProducts(item))} 
                    totalCount={contactPitchedProducts.length}
                    itemsPerPage={10} 
                />
            </div>
            <div className="bg-white p-6 rounded-md shadow">
                <div className="justify-between items-center mb-6 flex">
                    <h1 className="text-xl font-bold text-gray-800 mb-6">Documents</h1>
                    {/* <FormContainer table="documents" type="create" data={{ eventEntityId: id }} /> */}
                </div>
            </div>
        </div>
    )
}

export default SingleContactPage