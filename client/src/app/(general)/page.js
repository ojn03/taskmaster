import History from "@/components/History/History";
import Tickets from "@/components/Tickets/Tickets";
import Modal from "@/components/modal";
import { getTickets, getHistory } from "@/lib/functions";
import Image from "next/image";

export default async function Home() {
	const projid = 5;
	const userid = 1;
	const tickets = await getTickets({ projid });
	const history = await getHistory({ projid });
	return (
		<div className="h-full w-full">
			<div className="m-auto grid grid-cols-5">
				{/* row 1: team */}
				<div className="col-span-2">
				</div>

				{/* row 2: tickets */}
				<div className="w-fit col-span-2">
					{/* tickets component */}
					<Tickets tickets={tickets} />
				</div>

				{/* row 3: other */}
				<div className="col-span-1 grid grid-rows-5">
					{/* row 1: project view */}

					{/* row 3: history info */}
					<History  history={history}/>
				</div>
			</div>
		</div>
	);
}
