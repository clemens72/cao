import Link from "next/link"
import Image from "next/image"
import prisma from "@/lib/prisma"
import { Event, Product, Organization } from "@/generated/prisma"
import { notFound } from "next/navigation"
import FormContainer from "@/components/FormContainer"
import Table from "@/components/Table"
import { formatDate } from "@/lib/utils"

const SingleEventPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const { id } = await params;

    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            products: true
        }
    })

    if (!event) {
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
                                <span className="font-bold">Event Details</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold">{event.name}</h1>
                                <FormContainer table="events"
                                    type="update"
                                    data={event}
                                />
                            </div>
                            <p className="text-sm">
                                {formatDate(event.startDate)}
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/company.png" alt="" width={14} height={14} />
                                    <span>Organization, LLC</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/agent.png" alt="" width={14} height={14} />
                                    <span>Agent Johnson</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/mail.png" alt="" width={14} height={14} />
                                    <span>user@gmail.com</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/phone.png" alt="" width={14} height={14} />
                                    <span>(614) 123-4567</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {/* BOTTOM */}
                <div className="mt-4 bg-white rounded-md p-4">
                    {/* PRODUCTS TABLE */}
                    <div className="mb-8">
                        <h1 className="text-xl font-semibold mb-4">Products</h1>
                        {event.products.length > 0 ? (
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
                                        <td>{product.name}</td>
                                        <td className="max-w-xs truncate">{product.description}</td>
                                    </tr>
                                )}
                                data={event.products}
                            />
                        ) : (
                            <p className="text-gray-500 text-sm">No products found for this event.</p>
                        )}
                    </div>

                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Table Links</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs font-medium">
                        <Link className="p-3 rounded-md bg-orange" href={`/list/contacts?organizationId=${1}`}>
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

export default SingleEventPage