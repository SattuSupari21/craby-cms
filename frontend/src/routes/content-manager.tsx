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

import { Button } from '@/components/ui/button'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/content-manager')({
    component: ContentManagerComponent
})

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

async function getEntities() {
    const res = await fetch("http://127.0.0.1:3000/api/entity/getAllTables", { method: "GET" })
    if (!res.ok) {
        throw new Error()
    }
    const data = await res.json()
    if (data.error) {
        throw new Error()
    }
    return data
}

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

function ContentManagerComponent() {

    const entities = useQuery({ queryKey: ['get-entities'], queryFn: getEntities })
    const [entityName, setEntityName] = useState("")
    const schemaData = useQuery({ queryKey: ['get-schema'], queryFn: () => getSchema(entityName) })
    const tableData = useQuery({ queryKey: ['get-table-data'], queryFn: () => getTableData(entityName) })

    useEffect(() => {
        schemaData.refetch()
        tableData.refetch()
    }, [entityName]);

    if (entities.error) return "An error has occurred : " + entities.error.message
    if (schemaData.error) return "An error has occurred : " + schemaData.error.message
    if (tableData.error) return "An error has occurred : " + tableData.error.message

    return (
        <div className="grid min-h-screen w-full grid-cols-[240px_1fr]" >
            <div className="hidden border-r lg:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center px-6">
                        <span className='font-medium text-lg'>Content Types</span>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-8 text-sm font-medium space-y-1 mb-4">
                            {
                                entities.isPending ? Array(3).fill(0).map((_, index) => {
                                    return <div key={index}>
                                        <Skeleton className="h-[20px] mb-2 rounded-full" />
                                    </div>
                                }) : entities.data.tables.length < 0 ?
                                    <span>No entities found</span> :
                                    // @ts-ignore
                                    entities.data.tables.map((entity, index) => {
                                        return <ul key={index} className='list-disc list-inside'>
                                            <li className='mb-2 cursor-pointer' onClick={() => setEntityName(entity)}>{entity}</li>
                                        </ul>
                                    })
                            }
                        </nav>
                    </div>
                </div>
            </div>

            <div>
                {
                    !tableData.isPending && tableData.data.data.length < 0 ?
                        <div className='w-full h-full flex flex-col items-center justify-center gap-2'>
                            <span className='text-xl'>No data in table</span>
                            <Button><PlusIcon className='w-4 h-4 mr-2' />Add new entry</Button>
                        </div>
                        : <RenderEntityData entityName={entityName} schemaData={schemaData} tableData={tableData} />
                }
            </div>
        </div >
    )
}
