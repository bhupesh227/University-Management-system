import React, {ReactNode} from 'react';
import Image from 'next/image';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
 
const layout = async({children}: {children: ReactNode}) => {
  // CHECK FOR ACTIVE USER SESSION
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <main className='auth-container'>
        <section className='auth-form'>
            <div className='auth-box'>
               <div className='flex flex-row gap-5'>
                    <Image className='rounded-lg bg-orange-500 ' src='/icons/BorrowClub.svg' alt='logo' width={37} height={37} />
                    <h1 className='text-2xl font-semibold text-white '><span className='text-orange-500'>BorrowClub</span></h1>   
               </div>

               <div>
                     {children}                             
               </div>
            </div>
        </section>
        <section className='auth-illustration'>
            <Image src='/images/auth-illustration.png' alt='auth-illustration' width={1000} height={1000}
            className='size-full object-cover'/>
        </section>
    </main>
  )
}

export default layout