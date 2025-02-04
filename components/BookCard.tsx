import React from 'react'
import Link from 'next/link';
import BookCover from './BookCover';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {Button} from './ui/button';

// isLonedBook is a boolean value that is set to false by default which show the download receipt icon if it is true

const BookCard = ({
    id,
    title,
    genre,
    coverColor,
    coverUrl,
    isLoanedBook= false,                         // default value is false
}: Book) => (
    <li className={cn(isLoanedBook && "xs:w-52 w-full")}>              
         <Link href={`/books/${id}`} className={cn(isLoanedBook && 'w-full flex flex-col items-center')}>

            <BookCover coverColor={coverColor} coverImage={coverUrl}/>

            <div className={cn('mt-4', !isLoanedBook && 'xs:max-w-40 max-w-28')}>
                <p className='book-title'>{title}</p>
                <p className='book-genre'>{genre}</p>
            </div>

            {isLoanedBook && (                   // if isLonedBook is true then show the calender icon
                <div className='mt-3 w-full'>
                    <div className='book-loaned'>
                        <Image src='/icons/calendar.svg' alt='calender' width={18} height={18} 
                            className='object-contain' />
                        <p className='text-light-100'>11 days left to return</p>   
                    </div>  
                    <Button className='book-btn'>Download</Button>
                </div>
            )}
        </Link>

    </li>
);

export default BookCard