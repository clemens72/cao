"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { productSchema } from "@/lib/formValidationSchemas";
import { createProduct, updateProduct } from "@/lib/actions";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ProductForm = ({
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
        resolver: zodResolver(productSchema),
    })

    const [state, formAction] = useActionState(
        type === "create" ? createProduct : updateProduct,
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
            toast("Product " + (type === "create" ? " created" : " updated") + " successfully!", { type: "success" })
            setOpen(false);
            router.refresh();
        }

    }, [state, router, setOpen, type])

    const { contacts, agents } = relatedData;

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "New Product" : "Update Product"}
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
                    label="Description"
                    name="description"
                    defaultValue={data?.description}
                    register={register}
                    error={errors?.description}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Category</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("category")}
                        defaultValue={data?.category}
                    >
                        <option value="PRODUCTION">Production</option>
                        <option value="SERVICE">Service</option>
                        <option value="MERCHANDISE">Merchandise</option>
                        <option value="ENTERTAINER_MUSIC">Entertainer: Music</option>
                        <option value="ENTERTAINER_NON_MUSIC">Entertainer: Non-Music</option>
                    </select>
                    {errors.category?.message && (
                        <p className="text-xs text-red-400">
                            {errors.category.message.toString()}
                        </p>
                    )}
                </div>
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

export default ProductForm