import Image from "next/image";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";

import Avatar from "@/components/Avatar";
import BookList from "@/components/BookList";
import NotFound from "@/components/NotFound";
import { Button } from "@/components/ui/button";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";

import config from "@/lib/config";
import { getBorrowedBooks } from "@/lib/actions/book";

interface BorrowedBookProps {
  data: BorrowedBook[];
  success: boolean;
}

const Page = async () => {
  const session = await auth();
  if (!session?.user?.id) return;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session?.user?.id))
    .limit(1);

  if (!user) redirect("/404");

  const { data: borrowedBooks, success } = (await getBorrowedBooks(
    session?.user?.id
  )) as BorrowedBookProps;

  return (
    <>
      <section className="profile">
        <div className="id-card">
          <div className="inner">
            <div className="badge">
              <div className="badge-inner" />
            </div>


            <div className="mt-20 flex flex-row items-center gap-3">
              <Avatar name={user.fullName} size="lg" />

              <div>
                <p className="text-2xl font-semibold text-white">
                  {user.fullName}
                </p>
                <p className="text-base text-light-100">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-col items-end justify-center ">
              <form
              action={async () => {
                "use server";
                await signOut();
                redirect("/sign-in");
              }}
              >
                <Button type="submit" variant="destructive" className="logout hover:bg-light-200 hover:text-red-600">
                  Logout
                </Button>
              </form>
            </div>

            <div className="mt-5">
              <p className="text-lg text-light-100">University</p>
              <p className="text-2xl font-semibold text-white">
                Dont Need to know 
              </p>
            </div>

            <div className="mt-5">
              <p className="text-lg text-light-100">Student ID</p>
              <p className="text-2xl font-semibold text-white">
                {user.universityId}
              </p>
            </div>
             
            <div className="relative mt-10 h-72 md:w-1/2 w-full rounded-lg">
              <Image
                src={`${config.env.imagekit.urlEndpoint}${user.universityCard}`}
                alt="university-card"
                fill
                className="size-full rounded-xl"
              />
            </div>

            <div className="validity mt-4 mb-8">
              <p className="text-white text-pretty-sm font-semibold">
                Valid for {new Date().getFullYear()}-
                {new Date().getFullYear() + 1} Academic Year
              </p>
            </div>
          </div>
          
          
        </div>

        <div className="flex-1">
          {success &&
            (borrowedBooks.length > 0 ? (
              <BookList
                title="Borrowed Books"
                books={borrowedBooks}
                isBorrowed={true}
              />
            ) : (
              <NotFound
                title="No Borrowed Books"
                description="You haven't borrowed any books yet. Go to the library to borrow books."
              />
            ))}
        </div>
      </section>
    </>
  );
};

export default Page;
