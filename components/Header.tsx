"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";



const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  return (
    <header className="mt-10 flex items-center justify-between gap-5">
      <Link href="/">
        <Image src="/icons/BorrowClub.svg" alt="logo" width={50} height={50} className="rounded-lg bg-orange-400"/>  
      </Link>
      <ul className="flex flex-row items-center gap-8">
            
            <li className="cursor-pointer rounded-lg border border-light-200 px-4 py-2">
              <Link
              href="/library"
              className={cn(
                "text-base cursor-pointer capitalize font-semibold",
                pathname === "/library" ? "text-blue-500" : "text-yellow-500"
              )}
              >
                Library
            </Link>
            </li>
            <li>
          <Link href="/my-profile">
            <Avatar name={session?.user?.name || ""} />
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;