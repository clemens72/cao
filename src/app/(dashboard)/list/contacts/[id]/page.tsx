import Link from "next/link"
import Image from "next/image"
import prisma from "@/lib/prisma"
import { User, Organization, Event, Product } from "@/generated/prisma"
import { notFound } from "next/navigation"
import FormContainer from "@/components/FormContainer"
import { getAgentName } from "@/lib/utils"
import Table from "@/components/Table"

const SingleContactPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const { id } = await params;
    type ContactWithRelations = User & { 
        organizations: Organization[]
        managedEvents: Event[]
        productsAsLeader: Product[]
    }
    const contact: ContactWithRelations | null = await prisma.user.findUnique({
        where: { id },
        include: {
            organizations: true,
            managedEvents: {
                include: {
                    products: true
                }
            },
            productsAsLeader: true,
        },
    })

    if (!contact) {
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
                                <span className="font-bold">Contact Details</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold">{contact.firstName} {contact.lastName}</h1>
                                <FormContainer table="contacts"
                                    type="update"
                                    data={contact}
                                />
                            </div>
                            <p className="text-sm">
                                {contact.address}
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/company.png" alt="" width={14} height={14} />
                                    <span>Organizations: {contact.organizations.map(organization => organization.name).join(", ")}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/agent.png" alt="" width={14} height={14} />
                                    <span>Agent: {getAgentName(contact.agentId)}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/mail.png" alt="" width={14} height={14} />
                                    <span>{contact.email}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/phone.png" alt="" width={14} height={14} />
                                    <span>{contact.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {/* BOTTOM */}
                <div className="mt-4 bg-white rounded-md p-4">
                    {/* ORGANIZATIONS TABLE */}
                    <div className="mb-8">
                        <h1 className="text-xl font-semibold mb-4">Organizations</h1>
                        {contact.organizations.length > 0 ? (
                            <Table
                                columns={[
                                    { header: "Name", accessor: "name" },
                                    { header: "Type", accessor: "type" },
                                    { header: "Address", accessor: "address" },
                                ]}
                                renderRow={(organization: Organization) => (
                                    <tr key={organization.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightpurple">
                                        <td className="py-4">
                                            <Link href={`/list/organizations/${organization.id}`} className="font-medium hover:underline">
                                                {organization.name}
                                            </Link>
                                        </td>
                                        <td>{organization.type}</td>
                                        <td>{organization.addressId || "N/A"}</td>
                                    </tr>
                                )}
                                data={contact.organizations}
                            />
                        ) : (
                            <p className="text-gray-500 text-sm">No organizations found for this contact.</p>
                        )}
                    </div>

                    {/* EVENTS TABLE */}
                    <div className="mb-8">
                        <h1 className="text-xl font-semibold mb-4">Events</h1>
                        {contact.managedEvents.length > 0 ? (
                            <Table
                                columns={[
                                    { header: "Event Name", accessor: "name" },
                                    { header: "Start Date", accessor: "startDate" },
                                    { header: "End Date", accessor: "endDate" },
                                    { header: "Gross Price", accessor: "gross_price" },
                                ]}
                                renderRow={(event: Event & { products: Product[] }) => (
                                    <tr key={event.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightpurple">
                                        <td className="py-4">
                                            <Link href={`/list/events/${event.id}`} className="font-medium hover:underline">
                                                {event.name}
                                            </Link>
                                        </td>
                                        <td>{/* new Date(event.startDate).toLocaleDateString() */}</td>
                                        <td>{/* new Date(event.endDate).toLocaleDateString() */}</td>
                                        <td>{/* event.gross_price ? `$${event.gross_price.toFixed(2)}` : "N/A" */}</td>
                                    </tr>
                                )}
                                data={contact.managedEvents}
                            />
                        ) : (
                            <p className="text-gray-500 text-sm">No events found for this contact.</p>
                        )}
                    </div>

                    {/* PITCHED PRODUCTS TABLE */}
                    <div className="mb-8">
                        <h1 className="text-xl font-semibold mb-4">Pitched Products</h1>
                        {contact.productsAsLeader.length > 0 ? (
                            <Table
                                columns={[
                                    { header: "Product Name", accessor: "name" },
                                    { header: "Category", accessor: "category" },
                                    { header: "Description", accessor: "description" },
                                ]}
                                renderRow={(product: Product) => (
                                    <tr key={product.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightpurple">
                                        <td className="py-4">
                                            <Link href={`/list/products/${product.id}`} className="font-medium hover:underline">
                                                {product.name}
                                            </Link>
                                        </td>
                                        <td>{product.type}</td>
                                        <td className="max-w-xs truncate">{product.description}</td>
                                    </tr>
                                )}
                                data={contact.productsAsLeader}
                            />
                        ) : (
                            <p className="text-gray-500 text-sm">No pitched products found for this contact.</p>
                        )}
                    </div>
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Table Links</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs font-medium">
                        <Link className="p-3 rounded-md bg-orange" href={`/list/organizations?contactId=${2}`}>
                            Contact&apos;s Organizations
                        </Link>
                        <Link className="p-3 rounded-md bg-lightorange" href="/">
                            Contact&apos;s Tasks
                        </Link>
                        <Link className="p-3 rounded-md bg-orange" href={`/list/events?contactId=${2}`}>
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

export default SingleContactPage