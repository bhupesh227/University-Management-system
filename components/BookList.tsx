import React from 'react';
import {BookCard, BorrowedBook } from './BookCard';
import Sort from './Sort';
import NotFound from './NotFound';

interface Props {
  title: string;
  books: Book[] | BorrowedBook[];
  isBorrowed?: boolean;
  containerClassName?: string;
  showSorts?: boolean;
  showNoResultBtn?: boolean;
}

const BookList = ({title, books,isBorrowed, containerClassName, showSorts = false,showNoResultBtn = false,}: Props) => {
  return (
  <section className={containerClassName}>
    <div className="flex flex-row items-center justify-center gap-8">
        <h2 className="font-bebas-neue text-4xl text-blue-100 ">{title}</h2>

        {showSorts && <Sort />}
    </div>

    <ul className="book-list">
        {books.length > 0 ? (
          books.map((item,i) =>
            !isBorrowed ? (
              <BookCard key={item.id} {...(item as Book)} />
            ) : (
              <BorrowedBook key={i} {...(item as BorrowedBook)} />
            )
          )
        ) : (
          <NotFound linkBtn={showNoResultBtn} />
        )}
    </ul>
  </section>
  
  );
}

export default BookList