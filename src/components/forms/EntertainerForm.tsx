"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { entertainerSchema } from "@/lib/formValidationSchemas";
import { createEntertainer, updateEntertainer } from "@/lib/actions";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ContactSelector from "../ContactSelector";

const EntertainerForm = ({
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
        setValue,
    } = useForm({
        resolver: zodResolver(entertainerSchema),
    })

    const [selectedBookingContactPersonId, setSelectedBookingContactPersonId] = useState<string>(data?.event?.billingContactPersonEntityId || "");
    const [selectedBookingContactOrganizationId, setSelectedBookingContactOrganizationId] = useState<string | null>(data?.event?.billingContactOrganizationEntityId || null);
    const [selectedBookingContactId, setSelectedBookingContactId] = useState<string>(data?.product?.bookingContactPersonEntityId || "");

    const [state, formAction] = useActionState(
        type === "create" ? createEntertainer : updateEntertainer,
        {
            success: false,
            error: false,
        }
    );

    const onSubmit = handleSubmit(data => {
        // Add the selected client ID to the form data
        const submitData = {
            ...data
        };
        console.log(submitData);
        startTransition(() => {
            formAction(submitData as any);
        });
    });

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast("Entertainer " + (type === "create" ? " created" : " updated") + " successfully!", { type: "success" })
            setOpen(false);
            router.refresh();
        }

    }, [state, router, setOpen, type])

    const { contacts, productTypes, categories, electronicAddresses, agents } = relatedData;

    return (
        <form className="flex flex-col h-full max-h-[90vh] overflow-hidden" onSubmit={onSubmit}>
            {/* FIXED HEADER */}
            <div className="pb-6 px-6 border-b">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {type === "create" ? "New Entertainer" : "Update Entertainer"}
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
                        <InputField label="Name" name="name" defaultValue={data?.product?.name} register={register} error={errors?.name} />

                        {/* Electronic Addresses */}

                        <ContactSelector
                            label="Booking Contact"
                            contacts={contacts}
                            selectedContactId={selectedBookingContactId}
                            onContactSelect={(bookingContactId) => {
                                setSelectedBookingContactId(bookingContactId);
                                setValue("bookingContactId", bookingContactId);
                            }}
                            error={errors?.bookingContactId}
                        />

                        {/* Phones */}

                        <InputField label="Gross Price" name="grossPrice" defaultValue={data?.product?.grossPrice} register={register} error={errors?.grossPrice} />

                        <InputField label="Fee Percent" name="feePercent" defaultValue={data?.product?.feePercent} register={register} error={errors?.feePercent} />

                        {/* Available */}

                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Note</h2>
                        </div>
                        <div>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("note")}
                                rows={4}
                                defaultValue={data?.product?.note}
                                placeholder={"Additional notes..."}
                            />
                        </div>

                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">

                        {/* Product Types */}
                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Product Type</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("productTypeId")}
                                defaultValue={data?.product?.productTypeId || ""}
                            >
                                <option value="">
                                    Select a type
                                </option>
                                {productTypes?.map((pType: { id: string; description: string }) => (
                                    <option value={pType.id} key={pType.id}>
                                        {pType.description}
                                    </option>
                                ))}
                            </select>
                            {errors.productTypeId?.message && (
                                <p className="text-xs text-red-400">
                                    {errors.productTypeId.message.toString()}
                                </p>
                            )}
                        </div>

                        {/* Product Categories */}

                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Description</h2>
                        </div>
                        <div>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("description")}
                                rows={4}
                                defaultValue={data?.product?.description}
                                placeholder={"Description..."}
                            />
                        </div>

                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Bio</h2>
                        </div>
                        <div>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("bio")}
                                rows={4}
                                defaultValue={data?.entertainer?.bio}
                                placeholder={"Entertainer bio..."}
                            />
                        </div>

                        <InputField label="Special Requirements" name="specialRequirements" defaultValue={data?.entertainer?.specialRequirements} register={register} error={errors?.specialRequirements} />

                        <InputField label="Business Cards" name="businessCards" defaultValue={data?.entertainer?.businessCards} register={register} error={errors?.businessCards} />

                        {/* Active */}

                        <InputField label="Leader" name="leaderId" defaultValue={data?.entertainer?.leaderId} register={register} error={errors?.leaderId} />

                        <InputField label="Size" name="size" defaultValue={data?.entertainer?.size} register={register} error={errors?.size} />

                        {/* Exclusive */}

                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Agent</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("agentId")}
                                defaultValue={data?.entertainer?.agentPersonEntityId || ""}
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


                    </div>

                </div>
            </div>

            {/* FIXED FOOTER */}
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                <div>
                    {state.error && <span className="text-red-500 text-sm font-medium">Something went wrong!</span>}
                </div>
                <button className="bg-orange hover:bg-orange/90 text-white py-2.5 px-8 rounded-md font-semibold transition-colors shadow-sm">
                    {type === "create" ? "Create Entertainer" : "Update Entertainer"}
                </button>
            </div>
        </form>
    )
}

export default EntertainerForm