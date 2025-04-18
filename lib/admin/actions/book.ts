"use server";

import { books, borrowRecords, users } from "@/database/schema";
import { db } from "@/database/drizzle";
import { and, asc, count, desc, eq, getTableColumns, ilike, or } from "drizzle-orm";

const ITEMS_PER_PAGE = 15;

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

export async function getBorrowRecords({
  query,
  sort = "available",
  page = 1,
  limit = ITEMS_PER_PAGE,
}: QueryParams) {
  try {
    const offset = (page - 1) * limit;

    const searchConditions = query
      ? or(
          ilike(books.title, `%${query}%`),
          ilike(books.genre, `%${query}%`),
          ilike(users.fullName, `%${query}%`)
        )
      : undefined;

    const sortOptions = {
      newest: desc(books.createdAt),
      oldest: asc(books.createdAt),
      highestRated: desc(books.rating),
      available: desc(books.availableCopies),
    };

    const sortingCondition =
      sortOptions[sort as keyof typeof sortOptions] || sortOptions.available;

    const [borrowRecordsData, totalItems] = await Promise.all([
      db
        .select({
          ...getTableColumns(books),
          borrow: {
            ...getTableColumns(borrowRecords),
          },
          user: {
            ...getTableColumns(users),
          },
        })
        .from(borrowRecords)
        .innerJoin(books, eq(borrowRecords.bookId, books.id))
        .innerJoin(users, eq(borrowRecords.userId, users.id))
        .where(searchConditions ? and(searchConditions) : undefined)
        .orderBy(sortingCondition)
        .limit(limit)
        .offset(offset),

      db
        .select({ count: count() })
        .from(borrowRecords)
        .innerJoin(books, eq(borrowRecords.bookId, books.id))
        .innerJoin(users, eq(borrowRecords.userId, users.id))
        .where(searchConditions ? and(searchConditions) : undefined),
    ]);

    const totalCount = Number(totalItems[0]?.count) || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;

    return {
      success: true,
      data: borrowRecordsData,
      metadata: {
        totalPages,
        hasNextPage,
        totalCount,
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Error fetching borrow records:", error);
    return {
      success: false,
      error: "Something went wrong while fetching borrow records.",
    };
  }
}

export async function getBooks({
  query,
  sort = "available",
  page = 1,
  limit = ITEMS_PER_PAGE,
}: QueryParams) {
  try {
    const searchConditions = query
      ? or(
          ilike(books.title, `%${query}%`),
          ilike(books.genre, `%${query}%`),
          ilike(books.author, `%${query}%`)
        )
      : undefined;

    const sortOptions: Record<string, any> = {
      newest: desc(books.createdAt),
      oldest: asc(books.createdAt),
      highestRated: desc(books.rating),
      available: desc(books.totalCopies),
    };

    const sortingCondition = sortOptions[sort] || desc(books.createdAt);

    const booksData = await db
      .select()
      .from(books)
      .where(searchConditions)
      .orderBy(sortingCondition)
      .limit(limit)
      .offset((page - 1) * limit);

    const totalItems = await db
      .select({
        count: count(books.id),
      })
      .from(books)
      .where(searchConditions);

    const totalPages = Math.ceil(totalItems[0].count / ITEMS_PER_PAGE);
    const hasNextPage = page < totalPages;

    return {
      success: true,
      data: booksData,
      metadata: {
        totalPages,
        hasNextPage,
      },
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return {
      success: false,
      error: "An error occurred while fetching books",
    };
  }
}

export async function editBook(params: UpdateBookParams) {
  try {
    const existingBook = await db
      .select()
      .from(books)
      .where(eq(books.id, params.bookId))
      .limit(1);

    if (existingBook.length === 0) {
      return {
        success: false,
        error: "Book not found",
      };
    }

    // calculate availableCopies
    const availableCopies =
      params.totalCopies -
      (params.totalCopies - existingBook[0].availableCopies);

    const updatedBook = await db
      .update(books)
      .set({
        ...params,
        availableCopies,
      })
      .where(eq(books.id, params.bookId))
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedBook[0])),
    };
  } catch (error) {
    console.error("Error editing book:", error);
    return {
      success: false,
      error: "Error editing book",
    };
  }
}

export async function getBookadmin({ id }: { id: string }) {
  try {
    const book = await db.select().from(books).where(eq(books.id, id)).limit(1);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(book[0])),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Error getting book",
    };
  }
}
