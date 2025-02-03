//  home page

//  import Image from "next/image";
import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
// import {Button} from "@/components/ui/button";

const Home=() => (
   <>
    <BookOverview/>

    <BookList/>
   </>
  );
export default Home;