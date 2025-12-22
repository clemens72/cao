"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
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

    const { contacts, agents } = relatedData;

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
                    defaultValue={data?.id}
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

                        <InputField label="Name" name="name" defaultValue={data?.name} register={register} error={errors?.name} />
                        <InputField label="Address Line 1" name="address1" defaultValue={data?.address1} register={register} error={errors?.address1} />
                        <InputField label="Address Line 2" name="address2" defaultValue={data?.address2} register={register} error={errors?.address2} />
                        <InputField label="City" name="city" defaultValue={data?.city} register={register} error={errors?.city} />

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-600 font-medium mb-1.5">State</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                    {...register("state")}
                                    defaultValue={data?.state}
                                >
                                    <option value="">Select State</option>
                                    <option value="OH">Ohio</option>
                                    <option value="NY">New York</option>
                                    <option value="TX">Texas</option>
                                    <option value="FL">Florida</option>
                                    <option value="IL">Illinois</option>
                                </select>
                                {errors.state?.message && (
                                    <p className="text-xs text-red-400">
                                        {errors.state?.message.toString()}
                                    </p>
                                )}
                            </div>
                            <div>
                                <InputField label="Zip" name="zip" defaultValue={data?.zip} register={register} error={errors?.zip} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Country</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("country")}
                                defaultValue={data?.country}
                            >
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
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

                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Contact</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("contactId")}
                                defaultValue={data?.contactId}
                            >
                                <option value="" disabled>
                                    Select a contact
                                </option>
                                {contacts.map((contact: { id: number; firstName: string; lastName: string }) => (
                                    <option value={contact.id} key={contact.id}>
                                        {contact.firstName} {contact.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <InputField label="Phone Number" name="phone" defaultValue={data?.phone} register={register} error={errors?.phone} />
                        <InputField label="Email" name="email" defaultValue={data?.email} register={register} error={errors?.email} />
                        <InputField label="Resources" name="resources" defaultValue={data?.resources} register={register} error={errors?.resources} />

                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Note</label>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("note")}
                                rows={4}
                                defaultValue={data?.note}
                                placeholder={"Additional notes..."}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Classification</h2>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Type</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("type")}
                                defaultValue={data?.type}
                            >
                                <option value="">Select Type</option>
                                <option value="client">Client</option>
                                <option value="vendor">Vendor</option>
                                <option value="partner">Partner</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Agent</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("agentId")}
                                defaultValue={data?.agentId}
                            >
                                <option value="" disabled>
                                    Select an agent
                                </option>
                                {agents.map((agent: { id: number; firstName: string; lastName: string }) => (
                                    <option value={agent.id} key={agent.id}>
                                        {agent.firstName} {agent.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <InputField label="Referred by" name="referredBy" register={register} />

                        <div className="pt-3 pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Membership</h2>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">List Membership</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                name="membership"
                                multiple
                                size={6}
                            >
                                <option value="member_a">Member A</option>
                                <option value="member_b">Member B</option>
                                <option value="member_c">Member C</option>
                                <option value="member_d">Member D</option>
                                <option value="member_e">Member E</option>
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