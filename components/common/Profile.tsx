import { signOut } from "next-auth/react"

export function Profile() {
  return (
    <div className=" dark:bg-dark-800 absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-2xl ring-1 ring-white ring-opacity-15 focus:outline-none">
      <a
        href="#"
        className="block px-4 my-2 text-sm hover:text-sky-700"
        role="menuitem"
        id="user-menu-item-0"
      >
        Your Profile
      </a>
      <a
        href="#"
        className="block px-4 my-4 text-sm hover:text-sky-700"
        role="menuitem"
        id="user-menu-item-1"
      >
        Settings
      </a>
      <button
        onClick={() => signOut()}
        className="block px-4 my-2 text-sm hover:text-sky-700"
        role="menuitem"
        id="user-menu-item-2"
      >
        Sign out
      </button>
    </div>
  )
}
