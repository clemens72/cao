import Pagination from "@/components/Pagination"
import TableSearch from "@/components/TableSearch"
import Image from "next/image"
import Table from "@/components/Table"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { Prisma } from "@/generated/prisma/client"
import { auth } from "@clerk/nextjs/server"

type ResultList = Prisma.EntityGetPayload<{
  include: {
    organizationEntity: true;
    persons: true;
    products: true;
    events: true;
    tasks: true;
    users: true;
    entityType: true;
  }
}>
type SearchParams = { [key: string]: string | string[] | undefined }

function getFirst(value: string | string[] | undefined) {
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : value
}

const GlobalSearchPage = async ({
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
      header: "Type",
      accessor: "type",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    }
  ]

  const getRoutePath = (entityTypeDescription: string) => {
    const type = entityTypeDescription.toLowerCase();
    // Map "person" to "contacts" for the route
    if (type === "person") return "contacts";
    return `${type}s`;
  }

  const getDisplayName = (item: ResultList) => {
    if (item.persons?.[0]) {
      return `${item.persons[0].firstName} ${item.persons[0].lastName}`
    }
    if (item.organizationEntity?.[0]) {
      return item.organizationEntity[0].name
    }
    if (item.products?.[0]) {
      return item.products[0].name
    }
    if (item.events?.[0]) {
      return item.events[0].name
    }
    return "Unknown"
  }

  const renderRow = (item: ResultList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lightorange"
    >
      <td className="font-semibold pl-2">
        <Link href={`/list/${getRoutePath(item.entityType.description)}/${item.id}`}>
          {getDisplayName(item)}
        </Link>
      </td>
      <td className="hidden md:table-cell capitalize">{item.entityType.description.toLowerCase()}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/${getRoutePath(item.entityType.description)}/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-orange">
              <Image src="/view.png" alt="view" width={16} height={16} />
            </button>
          </Link>
        </div>
      </td>
    </tr>
  )

const paramsObj = await searchParams
  const { page, ...queryParams } = paramsObj

  const p = getFirst(page) ? parseInt(getFirst(page)!) : 1

  //URL PARAMS CONDITION
  const searchValue = getFirst(queryParams.search)
  const typeFilter = getFirst(queryParams.type)

  let query: Prisma.EntityWhereInput = {}

  if (searchValue) {
    query.OR = [
      { 
        persons: { 
          some: { 
            OR: [
              { firstName: { contains: searchValue, mode: "insensitive" } },
              { lastName: { contains: searchValue, mode: "insensitive" } }
            ]
          } 
        } 
      },
      { 
        organizationEntity: { 
          some: { 
            name: { contains: searchValue, mode: "insensitive" } 
          } 
        } 
      },
      { 
        products: { 
          some: { 
            name: { contains: searchValue, mode: "insensitive" } 
          } 
        } 
      },
      { 
        events: { 
          some: { 
            name: { contains: searchValue, mode: "insensitive" } 
          } 
        } 
      }
    ]
  }

  // Apply type filter
  if (typeFilter && typeFilter !== "all") {
    const typeMap: { [key: string]: string } = {
      "contacts": "1",
      "organizations": "2",
      "events": "3",
      "products": "4"
    }
    if (typeMap[typeFilter]) {
      query.entityTypeId = typeMap[typeFilter]
    }
  }

  //FETCH DATA
  const [data, count] = await prisma.$transaction([
    prisma.entity.findMany({
      where: query,
      include: {
        organizationEntity: true,
        persons: true,
        products: true,
        events: true,
        tasks: true,
        users: true,
        entityType: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.entity.count({ where: query })
  ])

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Global Search</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default GlobalSearchPage