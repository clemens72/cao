import Link from "next/link"
import Image from "next/image"
import FormModel from "@/components/FormModel"

const SingleProductPage = () => {
    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                {/* TOP */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* USER INFO CARD */}
                    <div className="bg-lightorange py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="flex flex-1 flex-col justify-between gap-4">
                            <div className='flex justify-between items-center'>
                                <span className="font-bold">Product Details</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold">Alice Johnson</h1>
                                <FormModel table="contacts" type="update" data={{
                                        fname: "Alice",
                                        lname: "Johnson",
                                        email: "aj@gmail.com",
                                    }}/>
                            </div>
                            <p className="text-sm">
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/company.png" alt="" width={14} height={14} />
                                    <span>Organization, LLC</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/agent.png" alt="" width={14} height={14} />
                                    <span>Agent Johnson</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/mail.png" alt="" width={14} height={14} />
                                    <span>user@gmail.com</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/phone.png" alt="" width={14} height={14} />
                                    <span>(614) 123-4567</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {/* BOTTOM */}
                <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
                    <h1>Organization Affiliation</h1>
                    <h1>Tasks</h1>
                    <h1>Log</h1>
                    <h1>Events</h1>
                    <h1>Pitched Products</h1>
                    <h1>Documents</h1>
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Table Links</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs font-medium">
                        <Link className="p-3 rounded-md bg-orange" href="/">
                            Organization&apos;s Contacts
                        </Link>
                        <Link className="p-3 rounded-md bg-lightorange" href="/">
                            Contact&apos;s Tasks
                        </Link>
                        <Link className="p-3 rounded-md bg-orange" href="/">
                            Contact&apos;s Events
                        </Link>
                        <Link className="p-3 rounded-md bg-lightorange" href="/">
                            Contact&apos;s Pitched Products
                        </Link>
                        <Link className="p-3 rounded-md bg-orange" href="/">
                            Contact&apos;s Documents
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleProductPage