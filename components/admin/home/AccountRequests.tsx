import Link from "next/link";

import UserCard from "../UserCard";
import { Button } from "@/components/ui/button";

import { getUsers } from "@/lib/admin/actions/user";

const AccountRequests = async () => {
  const { data: latestUsers } = await getUsers({
    sort: "newest",
    page: 1,
    limit: 6,
  });

  if (!latestUsers) {
    throw new Error("Failed to fetch latest users");
  }

  return (
    <section className="rounded-xl bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold  text-dark-400">
          Accounts
        </h3>

        <Button asChild className="view-btn">
          <Link href="/admin/accountRequests">View All</Link>
        </Button>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        {latestUsers?.length! > 0 &&
          latestUsers?.map(({ user }) => (
            <UserCard key={user.id} name={user.fullName} email={user.email} />
          ))}
      </div>
    </section>
  );
};

export default AccountRequests;
