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
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "New Organization" : "Update Organization"}
            </h1>
            <div className="flex justify-between flex-wrap gap-4">
                {data && (
                    <InputField
                        label="Id"
                        name="id"
                        defaultValue={data?.id}
                        register={register}
                        error={errors?.id}
                        hidden
                    />
                )}
                <InputField
                    label="Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />
                <InputField
                    label="Address"
                    name="address"
                    defaultValue={data?.address}
                    register={register}
                />
                <InputField
                    label="Note"
                    name="note"
                    defaultValue={data?.note}
                    register={register}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Type</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("type")}
                        defaultValue={data?.type}
                    >
                        <option value="AGENCY">Agency</option>
                        <option value="BANQUET_FACILITY">Banquet Facility</option>
                        <option value="BAR">Bar</option>
                        <option value="BUSINESS">Business</option>
                        <option value="CASINO">Casino</option>
                        <option value="CHURCH">Church</option>
                        <option value="CONCERT_VENUE">Concert Venue</option>
                        <option value="CONVENTION_CENTER">Convention Center</option>
                        <option value="COUNTRY_CLUB">Country Club</option>
                        <option value="EVENT_COMPLEX">Event Complex</option>
                        <option value="FESTIVAL_SITE">Festival Site</option>
                        <option value="FINE_ARTS_FACILITIES">Fine Arts Facilities</option>
                        <option value="FRATERNAL_ORGANIZATION">Fraternal Organization</option>
                        <option value="GOVERNMENT">Government</option>
                        <option value="HOSPITAL">Hospital</option>
                        <option value="HOTEL">Hotel</option>
                        <option value="LIBRARY_MUSEUM">Library/Museum</option>
                        <option value="LIVING_FACILITIES">Living Facilities</option>
                        <option value="OTHER">Other</option>
                        <option value="PARK">Park</option>
                        <option value="PRISONS">Prisons</option>
                        <option value="PRIVATE_HOME">Private Home</option>
                        <option value="RECREATION_COMMUNITY_CENTER">Recreation/Community Center</option>
                        <option value="RESTAURANT">Restaurant</option>
                        <option value="RETAIL">Retail</option>
                        <option value="SCHOOL">School</option>
                        <option value="SPORTS_FACILITY">Sports Facility</option>
                        <option value="THEATER">Theater</option>
                        <option value="UNIVERSITIES">Universities</option>
                    </select>
                    {errors.type?.message && (
                        <p className="text-xs text-red-400">
                            {errors.type.message.toString()}
                        </p>
                    )}
                </div>
                <InputField
                    label="Referral"
                    name="referral"
                    defaultValue={data?.referral}
                    register={register}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Contact</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("contactId")}
                        defaultValue={data?.contactId ?? ""}
                    >
                        <option value="" disabled>
                            Select a contact
                        </option>
                        {contacts.map((contact: { id: number; fname: string; lname: string }) => (
                            <option value={contact.id} key={contact.id}>
                                {contact.fname} {contact.lname}
                            </option>
                        ))}
                    </select>
                    {errors.contactId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.contactId.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Agent</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("agentId")}
                        defaultValue={data?.agentId ?? ""}
                    >
                        <option value="" disabled>
                            Select an agent
                        </option>
                        {agents.map((agent: { id: number; fname: string; lname: string }) => (
                            <option value={agent.id} key={agent.id}>
                                {agent.fname} {agent.lname}
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
            {state.error && <span className="text-red-500">Something went wrong!</span>}
            <button className="bg-orange text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    )
}

export default OrganizationForm