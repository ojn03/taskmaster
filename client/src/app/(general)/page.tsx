import Modal from "@/components/Modal";
import { useMutation } from "@tanstack/react-query";
import { getTickets, getHistory, getTeam } from "@/lib/functions";
import { getUser } from "@/actions/userService";
import DataTable from "@/components/data-table";
import * as Columns from "@/components/Columns";
import Ticket from "@/components/Ticket";

export default async function Home() {
  // const {
  //   mutate: server_getUser,
  //   isPending,
  //   isError,
  //   data,
  // } = useMutation({
  //   mutationFn: getUser,
  // });
  const projid = 3;
  const userid = 3;
  const tickets = await getTickets({ projid });
  const history = await getHistory({ projid });
  const team = await getTeam({ userid, projid });
  return (
    <div className="h-full w-full">
      <div className="h-1/5 "></div>
      <div className=" gap-2 p-2 grid grid-cols-5">
        {/* row 1: team */}
        <div className="col-span-2">
          <DataTable columns={Columns.teamColumns} data={team} />
        </div>

        {/* row 2: tickets */}
        <div className="w-fit col-span-2">
          {/* tickets component */}
          <DataTable columns={Columns.ticketColumns} data={tickets} />
        </div>

        {/* row 3: other */}
        <div className="col-span-1 ">
          {/* row 1: project view */}

          {/* row 3: history info */}
          <DataTable columns={Columns.historyColumns} data={history} />
          <Ticket />
        </div>
      </div>
    </div>
  );
}
