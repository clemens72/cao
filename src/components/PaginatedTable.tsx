"use client"

import { useState, ReactNode } from "react";

const PaginatedTable = ({
  columns,
  rows,
  totalCount,
  itemsPerPage = 10,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  rows: ReactNode[];
  totalCount: number;
  itemsPerPage?: number;
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Only paginate if data exceeds itemsPerPage
  const shouldPaginate = totalCount > itemsPerPage;
  
  const totalPages = shouldPaginate ? Math.ceil(totalCount / itemsPerPage) : 1;
  const startIndex = shouldPaginate ? (currentPage - 1) * itemsPerPage : 0;
  const endIndex = shouldPaginate ? startIndex + itemsPerPage : totalCount;
  const paginatedRows = shouldPaginate ? rows.slice(startIndex, endIndex) : rows;

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages, start + maxPagesToShow - 1);

      if (end - start + 1 < maxPagesToShow) {
        start = Math.max(1, end - maxPagesToShow + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <>
      <table className="w-full mt-4">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            {columns.map((col) => (
              <th key={col.accessor} className={col.className}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{paginatedRows}</tbody>
      </table>

      {shouldPaginate && (
        <div className="p-4 flex items-center justify-center gap-2 text-gray-500 w-full">
          <button
            className="py-2 px-4 rounded-md bg-orange hover:bg-orange/80 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-700"
            disabled={currentPage === 1}
            onClick={() => goToPage(1)}
          >
            First
          </button>

          <button
            disabled={currentPage === 1}
            className="py-2 px-4 rounded-md bg-orange hover:bg-orange/80 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-700"
            onClick={() => goToPage(currentPage - 1)}
          >
            Prev
          </button>

          <div className="flex items-center gap-2 text-sm">
            {pageNumbers.map(pageIndex => (
              <button
                key={pageIndex}
                className={`px-3 py-1 rounded-sm ${currentPage === pageIndex ? "bg-orange text-white" : "hover:bg-lightorange"
                  }`}
                onClick={() => goToPage(pageIndex)}
              >
                {pageIndex}
              </button>
            ))}
          </div>

          <button
            className="px-3 py-1 text-sm rounded-sm hover:bg-lightorange"
            hidden={currentPage === totalPages || currentPage === totalPages - 1 || currentPage === totalPages - 2 || currentPage === totalPages - 3}
            disabled={currentPage === totalPages}
            onClick={() => goToPage(totalPages)}
          >
            ...{totalPages}
          </button>

          <button
            className="py-2 px-4 rounded-md bg-orange hover:bg-orange/80 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-700"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </button>

          <div className="text-xs text-gray-500 ml-2">
            Showing {startIndex + 1}-{Math.min(endIndex, totalCount)} of {totalCount}
          </div>
        </div>
      )}
    </>
  );
};

export default PaginatedTable;
