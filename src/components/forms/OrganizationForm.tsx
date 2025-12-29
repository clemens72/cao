"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField, { PhoneFields, ElectronicAddressFields } from "../InputField";
import { organizationSchema } from "@/lib/formValidationSchemas";
import { createOrganization, updateOrganization } from "@/lib/actions";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const OrganizationForm = ({
    type,
    data,
    setOpen,
    relatedData,
}: {
    type: "create" | "update";
    data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: any;
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(organizationSchema),
    })

    const [state, formAction] = useActionState(
        type === "create" ? createOrganization : updateOrganization,
        {
            success: false,
            error: false,
        }
    );

    const onSubmit = handleSubmit(data => {
        console.log(data);
        startTransition(() => {
            formAction(data);
        });
    });

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast("Organization " + (type === "create" ? " created" : " updated") + " successfully!", { type: "success" })
            setOpen(false);
            router.refresh();
        }

    }, [state, router, setOpen, type])

    const { states, countries, phoneTypes, organizationTypes, agents, electronicAddressTypes, dynamicLists } = relatedData;

    return (
        <form className="flex flex-col h-full max-h-[90vh] overflow-hidden" onSubmit={onSubmit}>
            {/* FIXED HEADER */}
            <div className="pb-6 px-6 border-b">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {type === "create" ? "New Organization" : "Update Organization"}
                </h1>
            </div>

            {/* SCROLLABLE BODY - Two Column Layout */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                {data && (<InputField
                    label="Id"
                    name="id"
                    defaultValue={data?.entityId}
                    register={register}
                    error={errors?.id}
                    hidden
                />)}
                {data && (<InputField
                    label="entityTypeId"
                    name="entityTypeId"
                    defaultValue={data?.entityTypeId}
                    register={register}
                    error={errors?.id}
                    hidden
                />)}

                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 max-w-5xl">
                    {/* Left Column */}
                    <div className="space-y-5">
                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Basic Information</h2>
                        </div>

                        <InputField label="Name" name="name" defaultValue={data?.organization?.name} register={register} error={errors?.name} />
                        <InputField label="Address Line 1" name="address1" defaultValue={data?.address?.address1} register={register} error={errors?.address1} />
                        <InputField label="Address Line 2" name="address2" defaultValue={data?.address?.address2} register={register} error={errors?.address2} />
                        <InputField label="City" name="city" defaultValue={data?.address?.city} register={register} error={errors?.city} />

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-600 font-medium mb-1.5">State</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                    {...register("state")}
                                    defaultValue={data?.address?.stateId}
                                >
                                    <option value="">Select State</option>
                                    {states?.map((state: { id: string; code: string; description: string }) => (
                                        <option key={state.id} value={state.id}>
                                            {state.code} - {state.description}
                                        </option>
                                    ))}
                                </select>
                                {errors.state?.message && (
                                    <p className="text-xs text-red-400">
                                        {errors.state?.message.toString()}
                                    </p>
                                )}
                            </div>
                            <div>
                                <InputField label="Zip" name="zip" defaultValue={data?.address?.zip} register={register} error={errors?.zip} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Country</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("country")}
                                defaultValue={data?.address?.countryId}
                            >
                                <option value="">Select Country</option>
                                {countries?.map((country: { id: string; code: string; description: string }) => (
                                    <option key={country.id} value={country.id}>
                                        {country.code} - {country.description}
                                    </option>
                                ))}
                            </select>
                            {errors.country?.message && (
                                <p className="text-xs text-red-400">
                                    {errors.country?.message.toString()}
                                </p>
                            )}
                        </div>

                        <div className="pt-3 pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Contact Details</h2>
                        </div>

                        <PhoneFields defaultPhones={data?.phones} register={register} errors={errors} phoneTypes={phoneTypes} />
                        
                        <ElectronicAddressFields defaultElectronicAddresses={data?.electronicAddress} register={register} errors={errors} electronicAddressTypes={electronicAddressTypes} />

                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Notes</h2>
                        </div>
                        <div>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("note")}
                                rows={4}
                                defaultValue={data?.organization?.note}
                                placeholder={"Additional notes..."}
                            />
                        </div>

                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Classification</h2>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Organization Type</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("organizationTypes")}
                                multiple
                                size={6}
                                defaultValue={data?.organizationTypes?.map((ot: any) => ot.organizationTypeId) || []}
                            >
                                {organizationTypes?.map((orgType: { id: string; description: string }) => (
                                    <option key={orgType.id} value={orgType.id}>
                                        {orgType.description}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1.5">Hold Ctrl/Cmd to select multiple</p>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Agent</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("agentId")}
                                defaultValue={data?.organization?.agentPersonEntityId || ""}
                            >
                                <option value="">
                                    Select an agent
                                </option>
                                {agents?.map((agent: { entityId: string; firstName: string; lastName: string }) => (
                                    <option value={agent.entityId} key={agent.entityId}>
                                        {agent.firstName} {agent.lastName}
                                    </option>
                                ))}
                            </select>
                            {errors.agentId?.message && (
                                <p className="text-xs text-red-400">
                                    {errors.agentId.message.toString()}
                                </p>
                            )}
                        </div>

                        <InputField label="Referred by" name="referral" defaultValue={data?.organization?.referredBy} register={register} />

                        <div className="pt-3 pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Membership</h2>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">List Membership</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("dynamicLists")}
                                multiple
                                size={6}
                                defaultValue={data?.dynamicListMembers?.map((dlm: any) => dlm.dynamicListId) || []}
                            >
                                {dynamicLists?.map((list: { id: string; name: string; description: string }) => (
                                    <option key={list.id} value={list.id}>
                                        {list.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1.5">Hold Ctrl/Cmd to select multiple</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FIXED FOOTER */}
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                <div>
                    {state.error && <span className="text-red-500 text-sm font-medium">Something went wrong!</span>}
                </div>
                <button className="bg-orange hover:bg-orange/90 text-white py-2.5 px-8 rounded-md font-semibold transition-colors shadow-sm">
                    {type === "create" ? "Create Organization" : "Update Organization"}
                </button>
            </div>
        </form>


    )
}

export default OrganizationForm