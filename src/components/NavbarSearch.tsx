"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useState, FormEvent } from "react"

const NavbarSearch = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all")

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    
    if (!searchValue.trim()) {
      return
    }

    const params = new URLSearchParams()
    params.set("search", searchValue)
    
    if (typeFilter !== "all") {
      params.set("type", typeFilter)
    }

    router.push(`/search?${params.toString()}`)
  }

  return (
    <form 
      onSubmit={handleSearch}
      className='hidden md:flex items-center bg-white gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'
    >
      <button type="submit" className="flex items-center">
        <Image src="/search.png" alt="Search" width={14} height={14} />
      </button>
      <input 
        type="text" 
        placeholder="Global Search..." 
        className="w-[200px] p-2 bg-transparent outline-none"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <select 
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="bg-transparent outline-none cursor-pointer"
      >
        <option value="all">All</option>
        <option value="contacts">Contacts</option>
        <option value="organizations">Organizations</option>
        <option value="events">Events</option>
        <option value="products">Products</option>
      </select>
    </form>
  )
}

export default NavbarSearch
