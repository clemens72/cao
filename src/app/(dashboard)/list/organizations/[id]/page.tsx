import FormContainer from "@/components/FormContainer";
import prisma from "@/lib/prisma"
import { getElectronicAddressType, getPhoneType } from "@/lib/utils"

const SingleOrganizationPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const { id } = await params;

    const organization = await prisma.organization.findUnique({
        where: { entityId: id },
    });
    if (!organization) {
        return <div>Organization not found.</div>;
    }
    const entity = await prisma.entity.findUnique({
        where: { id: organization.entityId },
    });

    const address = await prisma.address.findFirst({
        where: { entityId: id || ""},
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
    const resources = await prisma.organizationResource.findMany({
        where: { organizationEntityId: id },
    });
    
    const agent = await prisma.person.findUnique({
        where: { entityId: organization.agentPersonEntityId || "" },
    })

    const organizationTypesData = await prisma.organizationTypes.findMany({
        where: { organizationEntityId: id },
        include: {
            organizationType: true
        }
    });

    const data = {
        entityId: organization.entityId,
        entityTypeId: entity?.entityTypeId,
        organization: organization,
        address: address,
        country: country,
        state: state,
        phones: phone,
        electronicAddress: electronicAddress,
        resources: resources,
        agent: agent,
        organizationTypes: organizationTypesData
    }


    return (
        <div className="flex-1 p-4 flex flex-col gap-4">
            {/* TOP SECTION - ORGANIZATION DETAILS */}
            <div className="w-full xl:w-2/3 bg-white p-6 rounded-md shadow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{organization.name}</h1>
                    <FormContainer table="organizations" type="update" data={data} />
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

                        {/* Resources */}
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-1">Resources</h3>
                            {resources.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {resources.map((r) => (
                                        <span key={r.id} className="px-3 py-1 bg-blue-200 text-sm rounded-full">
                                            {r.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">No resources available</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Note */}
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-1">Note</h3>
                            <p className="text-sm whitespace-pre-wrap">{organization.note || "No notes available"}</p>
                        </div>

                        {/* Type */}
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-1">Organization Type</h3>
                            {organizationTypesData.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {organizationTypesData.map((ot) => (
                                        <span key={ot.id} className="px-3 py-1 bg-blue-100 text-sm rounded-full">
                                            {ot.organizationType.description}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">No type assigned</p>
                            )}
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
                            <p className="text-sm">{organization.referredBy || ""}</p>
                        </div>

                        {/* List Membership */}
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-1">List Membership</h3>
                            <p className="text-sm">{"None"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleOrganizationPage