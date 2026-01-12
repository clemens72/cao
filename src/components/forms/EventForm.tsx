"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { eventSchema } from "@/lib/formValidationSchemas";
import { createEvent, updateEvent } from "@/lib/actions";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ClientSelector from "../ClientSelector";
import { formatDateTimeLocal } from "@/lib/utils";
import VenueSelector from "../ContactSelector";

const EventForm = ({
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
        resolver: zodResolver(eventSchema),
    })

    const [selectedClientPersonId, setSelectedClientPersonId] = useState<string>(data?.event?.clientPersonEntityId || "");
    const [selectedClientOrganizationId, setSelectedClientOrganizationId] = useState<string | null>(data?.event?.clientOrganizationEntityId || null);
    const [selectedVenuePersonId, setSelectedVenuePersonId] = useState<string>(data?.event?.venuePersonEntiutyId || "");
    const [selectedVenueOrganizationId, setSelectedVenueOrganizationId] = useState<string | null>(data?.event?.venueOrganizationEntityId || null);
    const [selectedBillingContactPersonId, setSelectedBillingContactPersonId] = useState<string>(data?.event?.billingContactPersonEntityId || "");
    const [selectedBillingContactOrganizationId, setSelectedBillingContactOrganizationId] = useState<string | null>(data?.event?.billingContactOrganizationEntityId || null);


    const [state, formAction] = useActionState(
        type === "create" ? createEvent : updateEvent,
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
            toast("Event " + (type === "create" ? " created" : " updated") + " successfully!", { type: "success" })
            setOpen(false);
            router.refresh();
        }

    }, [state, router, setOpen, type])

    const { agents, eventTypes, eventStatuses } = relatedData;

    return (
        <form className="flex flex-col h-full max-h-[90vh] overflow-hidden" onSubmit={onSubmit}>
            {/* FIXED HEADER */}
            <div className="pb-6 px-6 border-b">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {type === "create" ? "New Event" : "Update Event"}
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
                        <InputField label="Name" name="name" defaultValue={data?.event?.name} register={register} error={errors?.name} />

                        <ClientSelector
                            label="Client"
                            selectorId="event-client"
                            selectedPersonId={selectedClientPersonId}
                            selectedOrganizationId={selectedClientOrganizationId}
                            initialClientName={data.clientOrg ? `${data.clientOrg.name} - ${data.clientPerson ? data.clientPerson.firstName + " " + data.clientPerson.lastName : ""}`.trim() : data.clientPerson ? data.clientPerson.firstName + " " + data.clientPerson.lastName : ""}
                            onClientSelect={(clientPersonId, clientOrganizationId) => {
                                setSelectedClientPersonId(clientPersonId);
                                setSelectedClientOrganizationId(clientOrganizationId);
                                setValue("clientPersonEntityId", clientPersonId);
                                setValue("clientOrganizationEntityId", clientOrganizationId || "");
                            }}
                            error={errors?.clientPersonEntityId}
                        />

                        <ClientSelector
                            label="Venue"
                            selectorId="event-venue"
                            selectedPersonId={selectedVenuePersonId}
                            selectedOrganizationId={selectedVenueOrganizationId}
                            initialClientName={data.venueOrganization ? `${data.venueOrganization.name} - ${data.venuePerson ? data.venuePerson.firstName + " " + data.venuePerson.lastName : ""}`.trim() : data.venuePerson ? data.venuePerson.firstName + " " + data.venuePerson.lastName : ""}
                            onClientSelect={(venuePersonId, venueOrganizationId) => {
                                setSelectedVenuePersonId(venuePersonId);
                                setSelectedVenueOrganizationId(venueOrganizationId);
                                setValue("venuePersonEntityId", venuePersonId);
                                setValue("venueOrganizationEntityId", venueOrganizationId || "");
                            }}
                            error={errors?.clientPersonEntityId}
                        />

                        <InputField label="Location" name="location" defaultValue={data?.event?.location} register={register} error={errors?.location} />

                        <InputField label="Start Date" name="startDate" type="datetime-local" defaultValue={formatDateTimeLocal(data?.event?.startDate)} register={register} error={errors?.startDate} />
                        <InputField label="End Date" name="endDate" type="datetime-local" defaultValue={formatDateTimeLocal(data?.event?.endDate)} register={register} error={errors?.endDate} />

                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Event Type</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("eventTypeId")}
                                defaultValue={data?.event?.eventTypeId || ""}
                            >
                                <option value="">
                                    Select a type
                                </option>
                                {eventTypes?.map((eType: { id: string; description: string }) => (
                                    <option value={eType.id} key={eType.id}>
                                        {eType.description}
                                    </option>
                                ))}
                            </select>
                            {errors.agentId?.message && (
                                <p className="text-xs text-red-400">
                                    {errors.agentId.message.toString()}
                                </p>
                            )}
                        </div>

                        <ClientSelector
                            label="Billing Contact"
                            selectorId="event-billing-contact"
                            selectedPersonId={selectedBillingContactPersonId}
                            selectedOrganizationId={selectedBillingContactOrganizationId}
                            initialClientName={data.billingContactOrg ? `${data.billingContactOrg.name} - ${data.billingContactPerson ? data.billingContactPerson.firstName + " " + data.billingContactPerson.lastName : ""}`.trim() : data.billingContactPerson ? data.billingContactPerson.firstName + " " + data.billingContactPerson.lastName : ""}
                            onClientSelect={(billingPersonId, billingOrganizationId) => {
                                setSelectedBillingContactPersonId(billingPersonId);
                                setSelectedBillingContactOrganizationId(billingOrganizationId);
                                setValue("billingContactPersonEntityId", billingPersonId);
                                setValue("billingContactOrganizationEntityId", billingOrganizationId || "");
                            }}
                            error={errors?.billingContactPersonEntityId}
                        />

                        {/* Contacts */}

                        <InputField label="Budget" name="budget" defaultValue={data?.event?.budget} register={register} error={errors?.budget} />

                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Agent</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("agentId")}
                                defaultValue={data?.event?.agentPersonEntityId || ""}
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
                            {errors.eventTypeId?.message && (
                                <p className="text-xs text-red-400">
                                    {errors.eventTypeId.message.toString()}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                        
                        <div>
                            <label className="block text-xs text-gray-500 mb-1.5">Event Status</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("eventStatusId")}
                                defaultValue={data?.event?.eventStatusId || ""}
                            >
                                <option value="">
                                    Select a status
                                </option>
                                {eventStatuses?.map((eStatus: { id: string; description: string }) => (
                                    <option value={eStatus.id} key={eStatus.id}>
                                        {eStatus.description}
                                    </option>
                                ))}
                            </select>
                            {errors.eventStatusId?.message && (
                                <p className="text-xs text-red-400">
                                    {errors.eventStatusId.message.toString()}
                                </p>
                            )}
                        </div>

                        <InputField label="Contract Sent Date" name="contractSentDate" defaultValue={data?.event?.contractSentDate} register={register} error={errors?.contractSentDate} />
                        <InputField label="Contract Returned Date" name="contractReturnedDate" defaultValue={data?.event?.contractReturnedDate} register={register} error={errors?.contractReturnedDate} />

                        <div className="flex flex-col gap-2 w-full md:w-1/4">
                            <label className="text-xs text-gray-500">Event Form</label>
                            <select
                                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                                {...register("eventForm")}
                                defaultValue={data?.event.eventForm || ""}
                            >
                                <option value="N_A">N/A</option>
                                <option value="YES">Yes</option>
                                <option value="NO">No</option>
                            </select>
                            {errors.eventForm?.message && (
                                <p className="text-xs text-red-400">
                                    {errors.eventForm.message.toString()}
                                </p>
                            )}
                        </div>

                        <InputField label="Attendance" name="attendance" defaultValue={data?.event?.attendance} register={register} error={errors?.attendance} />

                        <InputField label="Guest Arrival Time" name="guestArrivalTime" defaultValue={data?.event?.guestArrivalTime} register={register} error={errors?.guestArrivalTime} />

                        <InputField label="Report To" name="reportTo" defaultValue={data?.event?.reportTo} register={register} error={errors?.reportTo} />

                        <InputField label="Break Area" name="breakArea" defaultValue={data?.event?.breakArea} register={register} error={errors?.breakArea} />

                        <InputField label="Equipment Storage" name="equipmentStorage" defaultValue={data?.event?.equipmentStorage} register={register} error={errors?.equipmentStorage} />

                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Notes</h2>
                        </div>
                        <div>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("note")}
                                rows={4}
                                defaultValue={data?.event?.note}
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
                    {type === "create" ? "Create Event" : "Update Event"}
                </button>
            </div>
        </form>
    )
}

export default EventForm