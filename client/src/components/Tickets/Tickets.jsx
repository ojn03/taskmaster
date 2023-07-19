import React from 'react'
import { DataTable } from '../Data-table'
import { columns } from './Columns'


const Tickets = ({ tickets }) => {

    return (
        <div>
            <DataTable columns={columns} data={tickets} />


        </div>
    )
}

export default Tickets