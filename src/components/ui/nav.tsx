"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const currentPage = usePathname();

  return (
    <div className="z-50 fixed top-0 flex flex-row justify-center items-center bg-transparent w-[100vw]">
      <div className="w-fit border shadow-md bg-white dark:bg-black h-fit mt-5 rounded-lg flex flex-row justify-center items-center">
        <Link
          href={"/explore"}
          className={
            "text-base font-semibold rounded-lg m-1 h-full p-3 px-5" +
            (currentPage === "/explore" && " text-white bg-pink-500")
          }
        >
          Explore
        </Link>
        <Link
          href={"/library"}
          className={
            "text-base font-semibold rounded-lg m-1 h-full p-3 px-5" +
            (currentPage === "/library" && " text-white bg-pink-500")
          }
        >
          Library
        </Link>
      </div>
    </div>
  );
}
