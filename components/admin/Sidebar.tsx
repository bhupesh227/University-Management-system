"use client";
import React from 'react';
import Image from 'next/image';
import { adminSideBarLinks } from '@/constants';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Avatar from '@/components/Avatar';
import { usePathname } from "next/navigation";
import { Session } from 'next-auth';

const Sidebar = ({ session }: { session: Session }) => {
    const pathname = usePathname();
  return (
    <div className='admin-sidebar bg-orange-100'>
        <div>
            <Link href={"/"} className='logo'>
                <Image src="/icons/admin/BorrowClub.svg" alt="logo" width={37} height={37}/>
                <h1>BorrowClub</h1>
            </Link>
            <div className='mt-10 flex flex-col gap-5'>
                {adminSideBarLinks.map((link)=>{
                    const isSelected =
                        (link.route !== "/admin" &&
                        pathname.includes(link.route) &&
                        link.route.length > 1) ||
                        pathname === link.route;

                    return (
                        <Link href={link.route} key={link.route}>
                            <div className={cn("link", isSelected && "bg-primary-admin shadow-sm",)}>
                                <div className='relative size-5'>
                                    <Image src={link.img} alt='icon' fill 
                                        className={`${isSelected ? 'brightness-0 invert' : ''} object-contain`}/>
                                </div>
                                <p className={cn(isSelected ? "text-white" : "text-dark")}>
                                    {link.text}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
        <div className="user">
            <Avatar name={session?.user?.name || ""} size="md"/>
            

            <div className="flex flex-col max-md:hidden">
                <p className="font-semibold text-dark-200">{session?.user?.name}</p>
                <p className="text-xs text-light-500">{session?.user?.email}</p>
            </div>
      </div>
    </div>
  )
}

export default Sidebar