import React from 'react';
import Image from 'next/image';
import BookCover from './BookCover';
import BorrowBook from './BorrowBook';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';

// using Book as an interface i.e generic types
interface Props extends Book {
  userId: string;
}

const BookOverview = async({
  title, 
  author, 
  genre, 
  rating, 
  totalCopies,
  availableCopies,
  description, 
  coverColor, 
  coverUrl, 
  id,
  userId,
}: Props) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return null;

  const borrowingEligibility = {
    isEligible: availableCopies > 0 && user?.status === "APPROVED",
    message:
      availableCopies <= 0
        ? "Book is not available"
        : "You are not eligible to borrow this book till the admin approves your account",
  };

  return( 
    <section className='book-overview'>
      <div className='flex flex-1 flex-col gap-5'>
        <h1><span className='text-yellow-300'>{title}</span></h1>

        <div className='book-info'>
            <p className='text-white'>By <span className='font-semibold text-green-500'>{author}</span></p>
            <p className='text-white'>Category{" "} <span className='font-semibold text-blue-600'>{genre}</span></p>
            <div className='flex flex-row gap-1'>
                <Image src="/icons/star.svg" alt="star" width={22} height={22} />
                <p>{rating}</p>
            </div>
        </div>

        <div className='book-copies'>
            <p>Total Books <span>{totalCopies}</span></p>
            <p>Available Books <span>{availableCopies}</span></p>
        </div>

        <p className='book-description text-blue-200'>{description}</p>

        {user && (
          <BorrowBook
            bookId={id}
            userId={userId}
            borrowingEligibility={borrowingEligibility}
          />
        )}
      </div>

      <div className='relative flex flex-1 justify-center'>
          <div className='relative'>
            <BookCover
              variant='wide'                                  // pass the variant prop
              className='z-10'                                // appear above the image
              coverColor={coverColor}                             // pass the coverColor prop
              coverImage={coverUrl}                             // pass the coverImage prop
            />

            <div className='absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden'>
              <BookCover
                variant='wide'                                  // pass the variant prop
                coverColor={coverColor}                             // pass the coverColor prop
                coverImage={coverUrl}                             // pass the coverImage prop
              />

            </div>
          </div>
      </div>
    </section>
  );
 
}

export default BookOverview