//  home page

//  import Image from "next/image";
import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { db } from "@/database/drizzle";
import { books, users } from "@/database/schema";
import { auth } from "@/auth";
import { desc } from "drizzle-orm";
// import {Button} from "@/components/ui/button";

const Home= async() => { 
  const session = await auth();

  const latestBooks = (await db
    .select()
    .from(books)
    .limit(11)
    .orderBy(desc(books.createdAt))) as Book[];
  return (
   <>
    <BookOverview {...latestBooks[0]} userId= {session?.user?.id as string}/>

    <BookList
        //  books={sampleBooks}
        title="Latest books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"

    />
   </>
  );
};
export default Home;