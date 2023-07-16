import React from 'react'
import { DataTable } from './Data-table'
import {columns} from './Columns'
const History = ({history}) => {
  return (
    <div>
        <DataTable columns={columns} data={history} />
    </div>
  )
}

export default History