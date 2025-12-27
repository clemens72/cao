import EventCalendarContainer from "@/components/EventCalendarContainer"
import FormContainer from "@/components/FormContainer"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import UserCard from "@/components/UserCard"
import { Prisma, Task } from "@/generated/prisma"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { auth } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils";

type TaskList = Task
type SearchParams = { [key: string]: string | string[] | undefined }

function getFirst(value: string | string[] | undefined) {
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : value
}

const AdminPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) => {

  const { sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    {
      header: "Task",
      accessor: "note",
    }, {
      header: "Agent",
      accessor: "agentId",
    },
    {
      header: "Created",
      accessor: "createdAt",
    }
  ]

  /* const renderRow = (item: TaskList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightorange"
    >
      <td className="font-semibold pl-2">{item.note}</td>
      <td className="hidden md:table-cell">{getPersonName(item.agentId)}</td>
      <td className="hidden md:table-cell">{formatDate(item.createdAt)}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/tasks/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-orange">
              <Image src="/view.png" alt="view" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormContainer table="tasks" type="update" data={item} />
              <FormContainer table="tasks" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  )

  const paramsObj = await searchParams
  const { page, ...queryParams } = paramsObj

  const p = getFirst(page) ? parseInt(getFirst(page)!) : 1

  //URL PARAMS CONDITION
  const query: Prisma.TaskWhereInput = {}

  if (queryParams) {
    const searchValue = getFirst(queryParams.search)
    if (searchValue) {
      query.note = { contains: searchValue, mode: "insensitive" }
    }
  }

  //FETCH DATA
  const [data, count] = await prisma.$transaction([

    prisma.task.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.task.count()
  ]) */

  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* LEFT */}
      <div className="w-full lg:w-2/3">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="tasks" />
          <UserCard type="events" />
          <UserCard type="progress" />
          <UserCard type="complete" />
        </div>
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-4'>
          {/* TASKS */}
          {/* <div className="flex items-center justify-between">
            <h1 className="hidden md:block text-lg font-semibold">All Tasks</h1>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <TableSearch />
              <div className="flex items-center gap-4 self-end">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lightorange">
                  <Image src="/filter.png" alt="filter" width={14} height={14} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lightorange">
                  <Image src="/sort.png" alt="filter" width={14} height={14} />
                </button>
                {role === "admin" && (
                  <FormContainer table="tasks" type="create" />
                )}
              </div>
            </div>
          </div> */}
        </div>
        {/* LIST */}
        {/* <Table columns={columns} renderRow={renderRow} data={data} /> */}
        {/* PAGINATION */}
        {/* <Pagination page={p} count={count} /> */}
      </div>
      {/* RIGHT */}
      {/* <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams} />
      </div> */}
    </div>
  )
}

export default AdminPage