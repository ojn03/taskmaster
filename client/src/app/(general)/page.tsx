import Test from "@/components/Ticket";
import Tickets from "@/app/(general)/_components/Tickets";
import UserProjects from "./_components/UserProjects";
import History from "./_components/History";
import Team from "./_components/Team";

export default async function Home() {
  const projid = 3;
  const userid = 3;
  return (
    <div className="h-full w-full">
      <div className="h-1/5 "></div>
      <div className=" gap-2 p-2 grid grid-cols-5">
        {/* row 1: team */}
        <div className="col-span-2">
          <Team userid={userid} />
        </div>

        {/* row 2: tickets */}
        <div className="w-fit col-span-2">
          <Tickets userid={userid} />
        </div>

        {/* row 3: other */}
        <div className="col-span-1 ">
          {/* row 1: project view */}
          <UserProjects userid={userid} className="absolute top-5 right-5" />

          {/* row 3: history info */}
          <History userid={userid} />
          <Test />
        </div>
      </div>
    </div>
  );
}
