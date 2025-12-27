import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image"
import NavbarSearch from "./NavbarSearch";

const Navbar = async () => {

  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const user = await currentUser()

  return (
    <div className='flex items-center bg-orange justify-between p-4'>
      {/* SEARCH BAR */}
      <NavbarSearch />
      <div>
        
      </div>
      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        <div className='flex bg-white rounded-full px-3 py-1'>
          <span>{formattedDate}</span>
        </div>
        <div className='flex flex-col'>
          <span className="font-medium bg-white rounded-full px-3 py-1">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
        <UserButton />
      </div>
    </div>
  )
}

export default Navbar