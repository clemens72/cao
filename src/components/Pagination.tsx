"use client"

import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";

const Pagination = ({
  page,
  count
}: {
  page: number
  count: number
}) => {

  const router = useRouter()

  const totalPages = Math.ceil(count / ITEM_PER_PAGE)
  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set("page", newPage.toString())
    router.push(`${window.location.pathname}?${params}`)
  }

  // Calculate which page numbers to show (max 3 pages)
  const getPageNumbers = () => {
    const pages: number[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show current page and surrounding pages
      let start = Math.max(1, page - 1)
      let end = Math.min(totalPages, start + maxPagesToShow - 1)

      // Adjust start if we're near the end
      if (end - start + 1 < maxPagesToShow) {
        start = Math.max(1, end - maxPagesToShow + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="p-4 flex items-center justify-center gap-2 text-gray-500 w-full">
      <button
        className="py-2 px-4 rounded-md bg-orange hover:bg-orange/80 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-700"
        disabled={page === 1}
        onClick={() => {
          changePage(1)
        }}
      >
        First Page
      </button>

      <button
        disabled={!hasPrev}
        className="py-2 px-4 rounded-md bg-orange hover:bg-orange/80 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-700"
        onClick={() => {
          changePage(page - 1)
        }}
      >
        Prev
      </button>

      <div className="flex items-center gap-2 text-sm">
        {pageNumbers.map(pageIndex => (
          <button
            key={pageIndex}
            className={`px-3 py-1 rounded-sm ${page === pageIndex ? "bg-orange text-white" : "hover:bg-lightorange"
              }`}
            onClick={() => {
              changePage(pageIndex)
            }}
          >
            {pageIndex}
          </button>
        ))}
      </div>

      <button
        className="px-3 py-1 text-sm rounded-sm hover:bg-lightorange"
        hidden={page === totalPages || page === totalPages - 1 || page === totalPages - 2 || page === totalPages - 3}
        disabled={page === totalPages}
        onClick={() => {
          changePage(totalPages)
        }}
      >
        ...{totalPages}
      </button>
      
      <button
        className="py-2 px-4 rounded-md bg-orange hover:bg-orange/80 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-700"
        disabled={!hasNext}
        onClick={() => {
          changePage(page + 1)
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
