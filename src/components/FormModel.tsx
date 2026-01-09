"use client"

import Image from "next/image";
import { Dispatch, useState, SetStateAction, useActionState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FormContainerProps } from "./FormContainer";
import { deleteContact, deleteEvent, deleteOrganization, deleteProduct, deleteTask, deleteEntertainer, deleteEventProduct, deleteOrganizationPerson } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const deleteActionMap = {
  contacts: deleteContact,
  organizations: deleteOrganization,
  products: deleteProduct,
  entertainers: deleteEntertainer,
  events: deleteEvent,
  tasks: deleteTask,
  eventProducts: deleteEventProduct,
  organizationPersons: deleteOrganizationPerson,
}

const ContactForm = dynamic(() => import("./forms/ContactForm"), {
  loading: () => <h1>Loading...</h1>,
});
const OrganizationForm = dynamic(() => import("./forms/OrganizationForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ProductForm = dynamic(() => import("./forms/ProductForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EntertainerForm = dynamic(() => import("./forms/EntertainerForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const TaskForm = dynamic(() => import("./forms/TaskForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventProductForm = dynamic(() => import("./forms/EventProductForm"), {
  loading: () => <h1>Loading...</h1>,
});
const OrganizationPersonForm = dynamic(() => import("./forms/OrganizationPersonForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    type: "create" | "update",
    setOpen: Dispatch<SetStateAction<boolean>>,
    data?: any,
    relatedData?: any,
  ) => React.JSX.Element;
} = {
  contacts: (type, setOpen, data, relatedData) => <ContactForm type={type} setOpen={setOpen} data={data} relatedData={relatedData} />,
  organizations: (type, setOpen, data, relatedData) => <OrganizationForm type={type} setOpen={setOpen} data={data} relatedData={relatedData} />,
  events: (type, setOpen, data, relatedData) => <EventForm type={type} setOpen={setOpen} data={data} relatedData={relatedData} />,
  products: (type, setOpen, data, relatedData) => <ProductForm type={type} setOpen={setOpen} data={data} relatedData={relatedData} />,
  entertainers: (type, setOpen, data, relatedData) => <EntertainerForm type={type} setOpen={setOpen} data={data} relatedData={relatedData} />,
  tasks: (type, setOpen, data, relatedData) => <TaskForm type={type} setOpen={setOpen} data={data} relatedData={relatedData} />,
  eventProducts: (type, setOpen, data, relatedData) => <EventProductForm type={type} setOpen={setOpen} data={data} relatedData={relatedData} />,
  organizationPersons: (type, setOpen, data, relatedData) => <OrganizationPersonForm type={type} setOpen={setOpen} data={data} relatedData={relatedData} />,
};

const FormModel = ({
  table,
  type,
  data,
  id,
  relatedData,
}:
  FormContainerProps &
  {
    relatedData?: any
  }) => {

  const size =
    type === "create"
      ? "w-8 h-8"
      : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lightorange hover:bg-orange"
      : type === "update"
        ? "hover:bg-orange"
        : "hover:bg-lightred"
  const text =
    type != "delete" && type != "update" && table === "products"
      ? "Product"
      : type != "delete" && type != "update" && table === "entertainers"
        ? "Entertainer"
        : ""

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useActionState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter()

    useEffect(() => {
      if (state.success) {
        toast(`${table.charAt(0).toUpperCase() + table.slice(1, -1)} deleted successfully!`, { type: "success" })
        setOpen(false);
        router.refresh();
      }

    }, [state, router])

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="hidden" name="id" defaultValue={id} />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, setOpen, data, relatedData)
    ) : (
      "Form not found!"
    );
  }

  return (
    <>
      <button
        className={`${size} w-fit p-2 flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}>
        <Image src={`/${type}.png`} alt="" width={16} height={16} />{text}
      </button>
      {open && (
        <div 
          className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div 
            className="bg-white p-4 rounded-md relative w-[90%] md:w-[80%] lg:w-[70%] lx:w-[60]% 2xl:w-[50%]"
            onClick={(e) => e.stopPropagation()}
          >
            <Form />
            <div
              className='absolute top-4 right-4 cursor-pointer'
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14}></Image>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FormModel