import prisma from "@/lib/prisma"
import FormContainer from "@/components/FormContainer"
import { getElectronicAddressType, getPhoneType } from "@/lib/utils";

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
        where: { entityId: person?.agentPersonEntityId || ""},
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

    return (
        <div className="flex-1 p-4 flex flex-col gap-4">
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
        </div>
    )
}

export default SingleContactPage