"use client";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	useReactTable
} from "@tanstack/react-table";
import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";

export function DataTable({ columns, data, ...props }) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		initialState: {
			pagination: {
				pageSize: 5
			}
		}
	});

	return (
		<div className="bg-dark/90 text-light rounded-md ">
			<Table>
				<TableHeader classname="overflow-scroll">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										style={{
											width: header.getSize()
										}}
										key={header.id}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								className=" "
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow className="">
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<div className="flex justify-between w-full">
				<div>
					<button
						className="border rounded p-1"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						{"<<"}
					</button>
					<button
						className="border rounded p-1"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						{"<"}
					</button>
					<button
						className="border rounded p-1"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						{">"}
					</button>
					<button
						className="border rounded p-1"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						{">>"}
					</button>
				</div>

				<span className="flex items-center gap-1">
					<div>Page</div>
					<strong>
						{table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</strong>
				</span>
				<span className="flex items-center gap-1">
					| Go to page:
					<input
						type="number"
						defaultValue={table.getState().pagination.pageIndex + 1}
						onChange={(e) => {
							const page = e.target.value ? Number(e.target.value) - 1 : 0;
							table.setPageIndex(page);
						}}
						className="border p-1 bg-transparent rounded w-16"
					/>
				</span>
			</div>
		</div>
	);
}
