"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { eventProductSchema } from "@/lib/formValidationSchemas";
import { createEventProduct, updateEventProduct } from "@/lib/actions";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ClientSelector from "../ClientSelector";
import VenueSelector from "../ContactSelector";

const EventProductForm = ({
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
        resolver: zodResolver(eventProductSchema),
    })

    const [selectedProductId, setSelectedProductId] = useState<string>(data?.productEntityId || "");
    const [selectedBookingContactPersonId, setSelectedBookingContactPersonId] = useState<string>(data?.event?.billingContactPersonEntityId || "");
    const [selectedBookingContactOrganizationId, setSelectedBookingContactOrganizationId] = useState<string | null>(data?.event?.billingContactOrganizationEntityId || null);
    const [selectedVenuePersonId, setSelectedVenuePersonId] = useState<string>(data?.event?.venuePersonEntiutyId || "");
    const [selectedVenueOrganizationId, setSelectedVenueOrganizationId] = useState<string | null>(data?.event?.venueOrganizationEntityId || null);
    const [selectedVenueResourceId, setSelectedVenueResourceId] = useState<string>(data?.venueOrganizationResourceId || "");
    const [selectedProductStatusId, setSelectedProductStatusId] = useState<string>(data?.productStatusId || "");

    const [state, formAction] = useActionState(
        type === "create" ? createEventProduct : updateEventProduct,
        {
            success: false,
            error: false,
        }
    );

    const onSubmit = handleSubmit(data => {
        const submitData = {
            ...data
        };
        console.log(submitData);
        startTransition(() => {
            formAction(submitData);
        });
    });

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast("Event Product " + (type === "create" ? " created" : " updated") + " successfully!", { type: "success" })
            setOpen(false);
            router.refresh();
        }
    }, [state, router, setOpen, type])

    const { contacts, products, venues, venueResources, productStatuses } = relatedData || {};

    return (
        <form className="flex flex-col h-full max-h-[90vh] overflow-hidden" onSubmit={onSubmit}>
            {/* FIXED HEADER */}
            <div className="pb-6 px-6 border-b">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {type === "create" ? "Add Product to Event" : "Update Event Product"}
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
                {data && (<InputField
                    label="eventEntityId"
                    name="eventEntityId"
                    defaultValue={data?.eventEntityId}
                    register={register}
                    error={errors?.eventEntityId}
                    hidden
                />)}

                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 max-w-5xl">
                    {/* Left Column */}
                    <div className="space-y-5">
                        {/* Product Name */}
                        {/* <ClientSelector
                            label="Product Name"
                            contacts={products?.map((p: any) => ({ entityId: p.entityId, firstName: p.name, lastName: "" })) || []}
                            selectedClientId={selectedProductId}
                            onClientSelect={(productId) => {
                                setSelectedProductId(productId);
                                setValue("productEntityId", productId);
                            }}
                            error={errors?.productEntityId}
                        /> */}

                        {/* Booking Contact */}
                        <ClientSelector
                            label="Booking Contact"
                            selectorId="event-booking-contact"
                            selectedPersonId={selectedBookingContactPersonId}
                            selectedOrganizationId={selectedBookingContactOrganizationId}
                            initialClientName={data.bookingContactOrg ? `${data.bookingContactOrg.name} - ${data.bookingContactPerson ? data.bookingContactPerson.firstName + " " + data.bookingContactPerson.lastName : ""}`.trim() : data.bookingContactPerson ? data.bookingContactPerson.firstName + " " + data.bookingContactPerson.lastName : ""}
                            onClientSelect={(bookingPersonId, bookingOrganizationId) => {
                                setSelectedBookingContactPersonId(bookingPersonId);
                                setSelectedBookingContactOrganizationId(bookingOrganizationId);
                                setValue("bookingContactPersonEntityId", bookingPersonId);
                                setValue("bookingContactOrganizationEntityId", bookingOrganizationId || "");
                            }}
                            error={errors?.bookingContactPersonEntityId}
                        />

                        {/* Venue */}
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
                            error={errors?.venuePersonEntityId}
                        />

                        {/* Venue Resource */}
                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Venue Resource</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                value={selectedVenueResourceId}
                                onChange={(e) => {
                                    setSelectedVenueResourceId(e.target.value);
                                    setValue("venueOrganizationResourceId", e.target.value);
                                }}
                            >
                                <option value="">Select Venue Resource...</option>
                                {venueResources?.map((resource: any) => (
                                    <option key={resource.id} value={resource.id}>
                                        {resource.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location */}
                        <InputField 
                            label="Location" 
                            name="location" 
                            defaultValue={data?.location} 
                            register={register} 
                            error={errors?.location} 
                        />

                        {/* Start Date */}
                        <InputField 
                            label="Start Date" 
                            name="startDate" 
                            defaultValue={data?.startDate} 
                            register={register} 
                            error={errors?.startDate}
                            type="date"
                        />

                        {/* End Date */}
                        <InputField 
                            label="End Date" 
                            name="endDate" 
                            defaultValue={data?.endDate} 
                            register={register} 
                            error={errors?.endDate}
                            type="date"
                        />

                        {/* Setup By */}
                        <InputField 
                            label="Setup By" 
                            name="setupBy" 
                            defaultValue={data?.setupBy} 
                            register={register} 
                            error={errors?.setupBy} 
                        />

                        {/* Group Size */}
                        <InputField 
                            label="Group Size" 
                            name="bandSize" 
                            defaultValue={data?.bandSize} 
                            register={register} 
                            error={errors?.bandSize} 
                        />

                        {/* Attire */}
                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Attire</h2>
                        </div>
                        <div>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("attire")}
                                rows={3}
                                defaultValue={data?.attire}
                                placeholder="Attire requirements..."
                            />
                        </div>

                        {/* Contracted to Provide */}
                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Contracted to Provide</h2>
                        </div>
                        <div>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("contractedToProvide")}
                                rows={3}
                                defaultValue={data?.contractedToProvide}
                                placeholder="What is contracted to provide..."
                            />
                        </div>

                        {/* Note */}
                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Note</h2>
                        </div>
                        <div>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("note")}
                                rows={4}
                                defaultValue={data?.note}
                                placeholder="Additional notes..."
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                        {/* Product Status */}
                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Product Status *</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                value={selectedProductStatusId}
                                onChange={(e) => {
                                    setSelectedProductStatusId(e.target.value);
                                    setValue("productStatusId", e.target.value);
                                }}
                            >
                                <option value="">Select Status...</option>
                                {productStatuses?.map((status: any) => (
                                    <option key={status.id} value={status.id}>
                                        {status.description}
                                    </option>
                                ))}
                            </select>
                            {errors?.productStatusId && (
                                <p className="text-xs text-red-400 mt-1">
                                    {errors.productStatusId.message?.toString()}
                                </p>
                            )}
                        </div>

                        {/* Contract Sent Date */}
                        <InputField 
                            label="Contract Sent Date" 
                            name="contractSentDate" 
                            defaultValue={data?.contractSentDate} 
                            register={register} 
                            error={errors?.contractSentDate}
                            type="date"
                        />

                        {/* Contract Returned Date */}
                        <InputField 
                            label="Contract Returned Date" 
                            name="contractReturnedDate" 
                            defaultValue={data?.contractReturnedDate} 
                            register={register} 
                            error={errors?.contractReturnedDate}
                            type="date"
                        />

                        {/* Deposit Required */}
                        <InputField 
                            label="Deposit Required" 
                            name="deposit" 
                            defaultValue={data?.deposit} 
                            register={register} 
                            error={errors?.deposit} 
                        />

                        {/* Payment Terms */}
                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Payment Terms</h2>
                        </div>
                        <div>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("paymentTerms")}
                                rows={3}
                                defaultValue={data?.paymentTerms}
                                placeholder="Payment terms..."
                            />
                        </div>

                        {/* Gross Price */}
                        <InputField 
                            label="Gross Price" 
                            name="grossPrice" 
                            defaultValue={data?.grossPrice} 
                            register={register} 
                            error={errors?.grossPrice} 
                        />

                        {/* Booking Fee Percentage */}
                        <InputField 
                            label="Booking Fee Percentage" 
                            name="feePercent" 
                            defaultValue={data?.feePercent} 
                            register={register} 
                            error={errors?.feePercent} 
                        />

                        {/* Booking Fee (calculated field - display only for now) */}
                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Booking Fee</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                                value="Calculated"
                                readOnly
                            />
                        </div>

                        {/* Product Fee (calculated field - display only for now) */}
                        <div>
                            <label className="block text-xs text-gray-600 font-medium mb-1.5">Product Fee</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-100"
                                value="Calculated"
                                readOnly
                            />
                        </div>

                        {/* Client Provides */}
                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Client Provides</h2>
                        </div>
                        <div>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("clientProvides")}
                                rows={3}
                                defaultValue={data?.clientProvides}
                                placeholder="What the client provides..."
                            />
                        </div>

                        {/* Special Instructions */}
                        <div className="pb-2 border-b border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Special Instructions</h2>
                        </div>
                        <div>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange focus:border-orange"
                                {...register("specialInstructions")}
                                rows={3}
                                defaultValue={data?.specialInstructions}
                                placeholder="Special instructions..."
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
                    {type === "create" ? "Add Product" : "Update Product"}
                </button>
            </div>
        </form>
    )
}

export default EventProductForm
