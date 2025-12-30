import Pagination from "@/components/Pagination"
import TableSearch from "@/components/TableSearch"
import Image from "next/image"
import Table from "@/components/Table"
import Link from "next/link"
import { Person } from "@/generated/prisma"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { Prisma } from "@/generated/prisma/client"
import { auth } from "@clerk/nextjs/server"
import FormContainer from "@/components/FormContainer"
import { getPersonName } from "@/lib/utils"

type ContactList = Person
type SearchParams = { [key: string]: string | string[] | undefined }

function getFirst(value: string | string[] | undefined) {
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : value
}

const ContactsListPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) => {

  const { sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Agent",
      accessor: "agent",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    }
  ]

  const renderRow = (item: ContactList) => (
    <tr
      key={item.entityId}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightorange"
    >
      <td className="font-semibold pl-2">
        <Link href={`/list/contacts/${item.entityId}`}>
          {item.firstName + " " + item.lastName}
        </Link>
      </td>
      <td className="hidden md:table-cell">{getPersonName(item.agentPersonEntityId)}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/contacts/${item.entityId}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-orange">
              <Image src="/view.png" alt="view" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <>
              {/* <FormContainer table="contacts" type="update" data={item} /> */}
              <FormContainer table="contacts" type="delete" id={item.entityId} />
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
  const query: Prisma.PersonWhereInput = {}

  if (queryParams) {
    const searchValue = getFirst(queryParams.search)
    if (searchValue) {
      query.OR = [
        { firstName: { contains: searchValue, mode: "insensitive" } },
        { lastName: { contains: searchValue, mode: "insensitive" } },
      ]
    }
  }

  //FETCH DATA
  const [data, count] = await prisma.$transaction([

    prisma.person.findMany({
      where: query,
      include: {
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.person.count()
  ])

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Contacts</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lightorange">
              <Image src="/filter.png" alt="filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lightorange">
              <Image src="/sort.png" alt="filter" width={14} height={14} />
            </button> */}
            {role === "admin" && (
              <FormContainer table="contacts" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default ContactsListPage