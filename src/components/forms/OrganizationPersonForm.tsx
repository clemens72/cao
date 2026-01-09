"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { organizationPersonSchema } from "@/lib/formValidationSchemas"
import { createOrganizationPerson, updateOrganizationPerson } from "@/lib/actions";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getPersonName } from "@/lib/utils";

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
    } = useForm({
        resolver: zodResolver(organizationPersonSchema),
    });

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

    const { } = relatedData;

    return (
        <form className="flex flex-col h-full max-h-[90vh] overflow-hidden" onSubmit={onSubmit}>
            {/* FIXED HEADER */}
            <div className="pb-6 px-6 border-b">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {type === "create" ? "New Contact" : "Update Contact"}
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
                />)}

                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 max-w-5xl">
                    {/* Left Column */}
                    <div className="space-y-5">
                        <InputField
                            label="Organization"
                            name="organizationId"
                            type="select"
                            defaultValue={data?.organizationEntityId}
                            register={register}
                            error={errors?.organizationEntityId}
                        />
                    </div>
                    {/* Right Column */}
                    <div className="space-y-5">
                        <InputField
                            label="Name"
                            name="personEntityId"
                            type="select"
                            defaultValue={data?.personEntityId}
                            register={register}
                            error={errors?.personEntityId}
                        />
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