import { Session } from "next-auth";
import Search from "./Search";


const Header = ({ session }: { session: Session }) => {
  return (
    <header className="admin-header">
      <div>
        <h2 className="text-2xl font-semibold text-dark-400">
          {session?.user?.name}
        </h2>
        <p className="text-base text-slate-700">
          Lets do some magic with your library
        </p>
      </div>

      <Search/>
    </header>
  );
};
export default Header;