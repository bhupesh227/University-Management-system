//  home page

//  import Image from "next/image";
import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { sampleBooks } from "@/constants";
// import {Button} from "@/components/ui/button";

const Home=() => (
   <>
    <BookOverview {...sampleBooks[0]}/>

    <BookList
        //  books={sampleBooks}
        title="Latest books"
        books={sampleBooks}
        containerClassName="mt-28"

    />
   </>
  );
export default Home;