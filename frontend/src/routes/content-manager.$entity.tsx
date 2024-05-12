import { Button } from '@/components/ui/button'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Edit2Icon, PlusIcon, Trash } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export const Route = createFileRoute('/content-manager/$entity')({
    component: Component
})

async function getSchema(entityName: string) {
    const res = await fetch("http://127.0.0.1:3000/api/entity/getTableSchema", {
        method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "table_name": entityName })
    })
    if (!res.ok) {
        throw new Error()
    }
    const data = await res.json()
    if (data.error) {
        throw new Error()
    }
    return data
}

async function getTableData(entityName: string) {
    const res = await fetch("http://127.0.0.1:3000/api/content/readFromTable", {
        method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "table_name": entityName })
    })
    if (!res.ok) {
        throw new Error()
    }
    const data = await res.json()
    if (data.error) {
        throw new Error()
    }
    return data
}

function RenderEntityData({ entityName, schemaData, tableData }: { entityName: string, schemaData: UseQueryResult<any, Error>, tableData: UseQueryResult<any, Error> }) {
    return (
        <div className='flex flex-col gap-12 p-4'>
            <div className='w-full flex items-center justify-between'>
                <div className='flex flex-col gap-1'>
                    <span className='text-4xl font-medium'>{entityName}</span>
                    <span className='text-sm'>{!tableData.isPending && tableData.data.data.length} entries found</span>
                </div>
                <Button className='rounded-sm'><PlusIcon className='w-6 h-6 mr-2' />Create new entry</Button>
            </div>

            <Table className='bg-card rounded-md'>
                <TableCaption>All your entries in table.</TableCaption>
                <TableHeader>
                    <TableRow>
                        {
                            !schemaData.isPending && schemaData.data.columns.map((value: string, index: number) => {
                                return <TableHead key={index}>{value.toUpperCase()}</TableHead>
                            })
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        // @ts-ignore
                        !tableData.isPending && tableData.data.data.map((data) => {
                            return <TableRow>
                                {
                                    !schemaData.isPending && schemaData.data.columns.map((col: string) => {
                                        return <TableCell>{data[col]}</TableCell>
                                    })
                                }
                                <TableCell className='flex'>
                                    <div className='ml-auto flex gap-2'>
                                        <Button variant={'outline'} ><Edit2Icon className='w-4 h-4' /></Button>
                                        <Button variant={'outline'} ><Trash className='w-4 h-4' /></Button>
                                    </div>
                                </TableCell>

                            </TableRow>
                        })
                    }
                </TableBody>
            </Table>
        </div >
    )
}

function Component() {

    const { entity } = Route.useParams()

    const schemaData = useQuery({ queryKey: ['get-schema'], queryFn: () => getSchema(entity) })
    const tableData = useQuery({ queryKey: ['get-table-data'], queryFn: () => getTableData(entity) })

    schemaData.refetch()
    tableData.refetch()

    if (schemaData.error) return "An error has occurred : " + schemaData.error.message
    if (tableData.error) return "An error has occurred : " + tableData.error.message

    return (
        <div className='flex flex-col gap-12 '>

            {
                !tableData.isPending && <RenderEntityData entityName={entity} schemaData={schemaData} tableData={tableData} />
            }

        </div >
    )
}
