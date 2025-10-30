"use client"

import Image from "next/image";
import { Dispatch, useState, SetStateAction, useActionState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FormContainerProps } from "./FormContainer";
import { deleteContact, deleteEvent, deleteOrganization, deleteProduct, deleteReport, deleteTask } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const deleteActionMap = {
  contacts: deleteContact,
  organizations: deleteOrganization,
  products: deleteProduct,
  events: deleteEvent,
  reports: deleteReport,
  tasks: deleteTask,
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
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ReportForm = dynamic(() => import("./forms/ReportForm"), {
  loading: () => <h1>Loading...</h1>,
});
const TaskForm = dynamic(() => import("./forms/TaskForm"), {
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
  reports: (type, setOpen, data) => <ReportForm type={type} setOpen={setOpen} data={data} />,
  tasks: (type, setOpen, data, relatedData) => <TaskForm type={type} setOpen={setOpen} data={data} relatedData={relatedData} />,
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

  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lightorange hover:bg-orange"
      : type === "update"
        ? "hover:bg-orange"
        : "hover:bg-lightred"

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useActionState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter()

    useEffect(() => {
      if (state.success) {
        toast("Report deleted successfully!", { type: "success" })
        setOpen(false);
        router.refresh();
      }

    }, [state, router])

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text | number" name="id" value={id} hidden />
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
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}>
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] lx:w-[50]% 2xl:w-[40%]">
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