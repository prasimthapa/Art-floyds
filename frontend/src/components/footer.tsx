import Link from "next/link";

export function Footer() {
  return <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
    <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © 2023
        <Link href="/" className="hover:underline">
          ArtFloyd™
        </Link>. All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
          <Link href="/about-us" className="hover:underline me-4 md:me-6">About Us</Link>
        </li>
        <li>
          <Link href="/faq" className="hover:underline me-4 md:me-6">FAQs</Link>
        </li>
        <li>
          <Link href="/contact-us" className="hover:underline me-4 md:me-6">Contact Us</Link>
        </li>
        <li>
          <Link href="/blogs" className="hover:underline">Blogs</Link>
        </li>
      </ul>
    </div>
  </footer>
}
