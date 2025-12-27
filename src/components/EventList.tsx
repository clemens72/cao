import prisma from "@/lib/prisma"
import Link from "next/link"

const EventList = async ({ dateParam

}: {
    dateParam: string | string[] | undefined
}) => {

    const date = dateParam ? new Date(dateParam as string) : new Date()

    const data = await prisma.event.findMany({
        where: {
            startDate: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lte: new Date(date.setHours(23, 59, 59, 999))
            }
        }
    })

    return data.map(event => (
        <div className="p-5 rounded-md border-2 border-gray border-t-4 odd:border-t-orange even:border-t-lightorange" key={event.entityId}>
            <div className='flex items-center justify-between'>
                <Link href={`/list/events/${event.entityId}`}>
                <h1 className='font-semibold'>{event.name}</h1>
                </Link>
                {/* <span className='text-xs'>{event.startDate.toLocaleTimeString('en-US',{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12:false
                })}</span> */}
            </div>
            <p className='text-darkgray whitespace-pre-wrap'>{event.note}</p>
        </div>
    ))
}

export default EventList