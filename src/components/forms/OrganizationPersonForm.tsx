"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { organizationPersonSchema } from "@/lib/formValidationSchemas"
import { createOrganizationPerson, updateOrganizationPerson } from "@/lib/actions";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { formatDate, formatDateTimeLocal } from "@/lib/utils";
import ContactSelector from "../ContactSelector";

const OrganizationPersonForm = ({
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
        resolver: zodResolver(organizationPersonSchema),
    });

    const [selectedContactId, setSelectedContactId] = useState<string>("");

    const [state, formAction] = useActionState(
        type === "create" ? createOrganizationPerson : updateOrganizationPerson,
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
            toast("Contact " + (type === "create" ? " created" : " updated") + " successfully!", { type: "success" })
            setOpen(false);
            router.refresh();
        }

    }, [state, router, setOpen, type])

    const { oaOrganization, oaPerson, contacts } = relatedData;

    return (
        <form className="flex flex-col h-full max-h-[90vh] overflow-hidden" onSubmit={onSubmit}>
            {/* FIXED HEADER */}
            <div className="pb-6 px-6 border-b">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {type === "create" ? "New Organization Affiliation" : "Update Organization Affiliation"}
                </h1>
            </div>

            {/* SCROLLABLE BODY - Two Column Layout */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                {data && (<InputField
                    label="personEntityId"
                    name="personEntityId"
                    defaultValue={data?.personEntityId}
                    register={register}
                    error={errors?.personEntityId}
                    hidden
                />)}

                {data && (<InputField
                    label="organizationEntityId"
                    name="organizationEntityId"
                    defaultValue={data?.organizationEntityId}
                    register={register}
                    error={errors?.organizationEntityId}
                    hidden
                />)}

                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 max-w-5xl">
                    {/* Left Column */}
                    <div className="space-y-5">
                        <InputField
                            label="Organization"
                            name="organizationId"
                            type="select"
                            defaultValue={oaOrganization? oaOrganization.name : data?.organization.name}
                            register={register}
                            error={errors?.organizationEntityId}
                            disabled
                        />
                        <InputField
                            label="Contact"
                            name="personName"
                            type="select"
                            defaultValue={oaPerson? oaPerson.firstName + " " + oaPerson.lastName : ""}
                            register={register}
                            error={errors?.personEntityId}
                            disabled={oaPerson ? true : false}
                            hidden={oaPerson ? false : true}
                        />
                        {type==="create" && (<ContactSelector
                            label="Contact"
                            contacts={contacts}
                            selectedContactId={selectedContactId}
                            onContactSelect={(contactId) => {
                                setSelectedContactId(contactId);
                                setValue("personEntityId", contactId);
                            }}
                            error={errors?.personEntityId}
                        />)}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPrimary"
                                {...register("isPrimary")}
                                defaultChecked={data?.isPrimary}
                                className="w-4 h-4 text-orange bg-gray-100 border-gray-300 rounded focus:ring-orange focus:ring-2"
                            />
                            <label htmlFor="isPrimary" className="text-sm text-gray-700">
                                Is Primary?
                            </label>
                        </div>
                        <InputField
                            label="Effective Date"
                            name="effectiveDate"
                            type="datetime-local"
                            defaultValue={formatDateTimeLocal(data?.effectiveDate) || new Date().toISOString().split('T')[0]}
                            register={register}
                            error={errors?.effectiveDate}
                        />
                        <InputField
                            label="Expiration Date"
                            name="expirationDate"
                            type="datetime-local"
                            defaultValue={data?.expirationDate}
                            register={register}
                            error={errors?.expirationDate}
                        />
                    </div>
                    {/* Right Column */}
                    <div className="space-y-5">
                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Note</h2>
                        </div>
                        <div>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("note")}
                                rows={4}
                                defaultValue={type==="update" ? data?.note : ""}
                                placeholder={"Additional notes..."}
                            />
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
                    {type === "create" ? "Create Contact" : "Update Contact"}
                </button>
            </div>
        </form>
    )
}

export default OrganizationPersonForm