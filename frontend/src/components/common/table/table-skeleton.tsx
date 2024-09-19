
import { Table } from "flowbite-react"
export const CellSkeleton = () => {
    return (
        <>
        <Table.Cell  className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-center">
            <div role="status" className="max-w-sm animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-4"></div>
            </div>
            </Table.Cell>
        </>
    )
}

export const RowSkeleton = ({rows, columns}:{rows:number, columns:number}) => {
    return (
        <>
       {
        [...Array(rows)].map((_, i:number) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={i}>
            {
                [...Array(columns)].map((_, j:number) => (
                <CellSkeleton key={j}/>
                ))
        }
           
          </Table.Row>
        )) 
       
           }
        </>
    )
}