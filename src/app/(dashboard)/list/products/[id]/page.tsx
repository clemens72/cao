import prisma from "@/lib/prisma"
import FormContainer from "@/components/FormContainer"
import { getElectronicAddressType, getPersonName, getPhoneType, getProductCategoryName } from "@/lib/utils";
import Table from "@/components/Table";

const SingleProductPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { entityId: id },
    })
    if (!product) {
        return <div>Product not found.</div>;
    }
    const productTypeId = await prisma.productType.findUnique({
        where: { id: product.productTypeId },
    })
    const productType = await prisma.productType.findUnique({
        where: { id: product.productTypeId },
    })
    const table = productTypeId?.description === "Entertainer - Music" || productTypeId?.description === "Entertainer - Non-Music"
        ? "entertainers"
        : "products";

    const bookingPerson = await prisma.person.findUnique({
        where: { entityId: product?.bookingContactPersonEntityId || "" },
    })
    const bookingAddress = await prisma.address.findFirst({
        where: { entityId: bookingPerson?.entityId || "" },
    });
    const bookingState = await prisma.state.findUnique({
        where: { id: bookingAddress?.stateId || "" },
    });
    const bookingCountry = await prisma.country.findUnique({
        where: { id: bookingAddress?.countryId || "" },
    });

    const productCategories = await prisma.productCategory.findMany({
        where: { entityId: id || "" },
    });

    const phone = await prisma.phone.findMany({
        where: { entityId: id || "" },
    });
    const electronicAddress = await prisma.electronicAddress.findMany({
        where: { entityId: id || "" },
    });

    /* Entertainer Data */
    const entertainer = await prisma.entertainer.findUnique({
        where: { productEntityId: id || "" },
    })
    const agent = await prisma.person.findUnique({
        where: { entityId: entertainer?.agentPersonEntityId || "" },
    })
    const leader = await prisma.person.findUnique({
        where: { entityId: entertainer?.leaderPersonEntityId || "" },
    })

    const data = {
        ...product,
        entertainer,
        agent
    };

    return (
        <div className="flex-1 p-4 flex flex-col gap-4">
            <div className="flex flex-col xl:flex-row gap-4">
                {/* TOP SECTION - CONTACT DETAILS */}
                <div className="w-full xl:w-2/3 bg-white p-6 rounded-md shadow">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">{product.name}</h1>
                        <FormContainer table={table} type="update" data={data} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-8">

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

                            {/* Booking Contact */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Booking Contact</h3>
                                {bookingPerson?.firstName} {bookingPerson?.lastName}
                                <div></div>
                                {bookingAddress ? (
                                    <p className="text-sm">
                                        {bookingAddress.address1}, {bookingAddress.address2}
                                        <br />
                                        {bookingAddress.city}, {bookingState?.code} {bookingAddress.zip} {bookingAddress.zipExtension}
                                        <br />
                                        {bookingCountry?.description}
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

                            {/* Gross Price */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Gross Price</h3>
                                <p className="text-sm">{product.grossPrice}</p>
                            </div>

                            {/* Fee Percent */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Fee Percent</h3>
                                <p className="text-sm">{product.feePercent}%</p>
                            </div>

                            {/* Available */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Available</h3>
                                <p className="text-sm">{product?.available}</p>
                            </div>

                            {/* Note */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Note</h3>
                                <p className="text-sm whitespace-pre-wrap">{product.note || "No notes available"}</p>
                            </div>

                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Product Type */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Product Type</h3>
                                <p className="text-sm">{productType?.description || ""}</p>
                            </div>

                            {/* Categories */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Categories</h3>
                                {productCategories.length > 0 ? (
                                    <div className="space-y-1">
                                        {productCategories.map((pc) => (
                                            <p key={pc.entityId} className="text-sm">
                                                {getProductCategoryName(pc.productTypeCategoryId)}
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">No categories assigned</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-1">Description</h3>
                                <p className="text-sm whitespace-pre-wrap">{product.description || ""}</p>
                            </div>

                            {/* Entertainer-specific fields */}
                            {table === "entertainers" && (
                                <>
                                    {/* Leader */}
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                        <h3 className="text-sm font-semibold text-gray-600 mb-1">Leader</h3>
                                        {leader ? (
                                            <p className="text-sm">{leader.firstName} {leader.lastName}</p>
                                        ) : (
                                            <p className="text-sm text-red-400">No leader assigned</p>
                                        )}
                                    </div>

                                    {/* Size */}
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                        <h3 className="text-sm font-semibold text-gray-600 mb-1">Size</h3>
                                        <p className="text-sm">{entertainer?.bandSize || ""}</p>
                                    </div>

                                    {/* Bio */}
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                        <h3 className="text-sm font-semibold text-gray-600 mb-1">Bio</h3>
                                        <p className="text-sm whitespace-pre-wrap">{entertainer?.bio || ""}</p>
                                    </div>

                                    {/* Special Requirements */}
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                        <h3 className="text-sm font-semibold text-gray-600 mb-1">Special Requirements</h3>
                                        {/* <p className="text-sm">{entertainer?.bandSize || ""}</p> */}
                                    </div>

                                    {/* Business Cards */}
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                        <h3 className="text-sm font-semibold text-gray-600 mb-1">Business Cards</h3>
                                        {/* <p className="text-sm">{entertainer?.bandSize || ""}</p> */}
                                    </div>

                                    {/* Exclusive */}
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                                        <h3 className="text-sm font-semibold text-gray-600 mb-1">Active</h3>
                                        <p className="text-sm">{entertainer?.isExclusive || ""}</p>
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
                                </>
                            )}

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

            {/* BOTTOM SECTION - EVENTS & DOCUMENTS */}
            <div className="bg-white p-6 rounded-md shadow">
                <div className="justify-between items-center mb-6 flex">
                    <h1 className="text-xl font-bold text-gray-800 mb-6">Events</h1>
                    <FormContainer table="tasks" type="create" data={{ eventEntityId: id }} />
                </div>
                <Table columns={[
                    { header: "Name", accessor: "name" },
                    { header: "Date", accessor: "date" },
                    { header: "Product Status", accessor: "productStatus" },
                    { header: "Contract Returned", accessor: "contractReturned" },
                    { header: "Gross Price", accessor: "grossPrice" }
                ]} renderRow={() => null} data={[]} />
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

export default SingleProductPage