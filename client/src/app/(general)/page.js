import Tickets from "@/components/Tickets/Tickets";
import Modal from "@/components/modal";
import { getTickets } from "@/lib/functions";
import Image from "next/image";

export default async function Home() {
	const projid = 5;
	const tickets = await getTickets({ projid });
	return (
		<div className="h-full w-full">
			<div className="m-auto grid grid-cols-5">
				{/* row 1: team */}
				<div className="col-span-2">{/* team component */}</div>

				{/* row 2: tickets */}
				<div className="w-fit col-span-2">
					{/* tickets component */}
					<Tickets tickets={tickets} />
				</div>

				{/* row 3: other */}
				<div className="col-span-1"></div>
			</div>
		</div>
	);
}
