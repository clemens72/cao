"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
    fname: z
        .string()
        .min(1, { message: "First name is required." }),
    lname: z
        .string()
        .min(1, { message: "Last name is required." }),
    email: z.string().email({ message: "Invalid email address." }),
})

type Inputs = z.infer<typeof schema>

const OrganizationForm = ({
    type,
    data,
}: {
    type: "create" | "update";
    data?: any;
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    })

    const onSubmit = handleSubmit(data => {
        console.log(data);
    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Create a new organization</h1>
            <span className="text-xs text-gray-400 font-medium">General Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="First Name"
                    name="fname"
                    defaultValue={data?.fname}
                    register={register}
                    error={errors.fname}
                />
                <InputField
                    label="Last Name"
                    name="lname"
                    defaultValue={data?.lname}
                    register={register}
                    error={errors.lname}
                />
                <InputField
                    label="Email Address"
                    name="email"
                    defaultValue={data?.email}
                    register={register}
                    error={errors.email}
                />
            </div>
            <span className="text-xs text-gray-400 font-medium">More Information</span>
            <button className="bg-orange text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
        </form>
    )
}

export default OrganizationForm