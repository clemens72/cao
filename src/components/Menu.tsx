import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/admin",
        visible: ["admin", "agent", "client", "talent"],
      },
      {
        icon: "/organizations.png",
        label: "Organizations",
        href: "/list/organizations",
        visible: ["admin", "agent"],
      },
      {
        icon: "/contacts.png",
        label: "Contacts",
        href: "/list/contacts",
        visible: ["admin", "agent"],
      },
      {
        icon: "/profile.png",
        label: "Products",
        href: "/list/products",
        visible: ["admin", "agent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin"],
      },
      {
        icon: "/reporting.png",
        label: "Reporting",
        href: "/list/reporting",
        visible: ["admin", "agent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "agent", "client", "talent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "agent", "client", "talent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "agent", "client", "talent"],
      },
    ],
  },
];

const Menu = async () => {
  
  const user = await currentUser()
  const role = user?.publicMetadata.role as string

  return (
    <div className="mt-4 text-sm">
      {menuItems.map(i => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">{i.title}</span>
          {i.items.map(item => (
            <Link
              href={item.href}
              key={item.label}
              className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lightorange"
            >
              <Image src={item.icon} alt="" width={20} height={20} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Menu