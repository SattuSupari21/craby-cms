import { Button } from '@/components/ui/button'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
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
import { toast } from '@/components/ui/use-toast'
import { format } from "date-fns"
import { useEffect } from 'react'


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

async function getPrimaryKey(entity: string) {
    const res = await fetch("http://127.0.0.1:3000/api/content/getPrimaryKey", {
        method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "table_name": entity })
    })

    if (!res.ok) return;

    const data = await res.json();
    return data
}

async function deleteEntry(entityName: string, tableEntry: {}, tableData: UseQueryResult<any, Error>) {
    const pk_res = await fetch("http://127.0.0.1:3000/api/content/getPrimaryKey", {
        method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "table_name": entityName })
    })

    let pk = ""
    if (pk_res.ok) {
        const data = await pk_res.json()
        pk = data.pk
    }

    const res = await fetch("http://127.0.0.1:3000/api/content/deleteFromTable", {
        method: "DELETE", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // @ts-ignore
        body: JSON.stringify({ "table_name": entityName, "id": tableEntry[pk] })
    })
    tableData.refetch();
    if (!res.ok) {
        return toast({ title: "Error", description: "An error occurred" })
    }
    const data = await res.json()
    if (data.error) {
        return toast({ title: "Error", description: "An error occurred" })
    }
    return toast({ title: "Success", description: "Entry deleted successfully" })
}

function RenderEntityData({ entityName, schemaData, tableData, primaryKey }: {
    entityName: string,
    schemaData: UseQueryResult<any, Error>,
    tableData: UseQueryResult<any, Error>,
    primaryKey: string
}) {
    return (
        <div className='flex flex-col gap-12 p-8'>
            <div className='w-full flex items-center justify-between'>
                <div className='flex flex-col gap-1'>
                    <span className='text-4xl font-medium'>{entityName}</span>
                    <span className='text-sm'>{!tableData.isPending && tableData.data.data.length} entries found</span>
                </div>
                <Link to="/content-manager/$entity/create" params={{ entity: entityName }} ><Button className='rounded-sm'><PlusIcon className='w-6 h-6 mr-2' />Create new entry</Button></Link>
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
                        !schemaData.isPending && !tableData.isPending && tableData.data.data.map((data, index: number) => {
                            console.log(schemaData.data)
                            return <TableRow key={index}>
                                {
                                    !schemaData.isPending && !tableData.isPending && schemaData.data.columns.map((col: string, index: number) => {
                                        if (schemaData.data.dataTypes[index] === "date") {
                                            return <TableCell key={index}>{data[col] && format(new Date(data[col]), "dd MMMM yyyy")}</TableCell>
                                        }
                                        return <TableCell key={index}>{data[col]}</TableCell>
                                    })
                                }
                                <TableCell className='flex'>
                                    <div className='ml-auto flex gap-2'>
                                        <Link to='/content-manager/$entity/update/$id' params={{ entity: entityName, id: data[primaryKey] }} ><Button variant={'outline'} ><Edit2Icon className='w-4 h-4' /></Button></Link>
                                        <Button variant={'outline'} onClick={() => {
                                            deleteEntry(entityName, data, tableData)
                                        }}  ><Trash className='w-4 h-4' /></Button>
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
    const key = useQuery({ queryKey: ['get-primary-key'], queryFn: () => getPrimaryKey(entity) })

    useEffect(() => {
        schemaData.refetch()
        tableData.refetch()
    }, [entity])

    if (schemaData.error) return "An error has occurred : " + schemaData.error.message
    if (tableData.error) return "An error has occurred : " + tableData.error.message
    if (key.error) return "An error has occurred!"

    return (
        <div className='flex flex-col gap-12 '>
            {
                !schemaData.isPending && !tableData.isPending && !key.isPending &&
                <RenderEntityData
                    entityName={entity}
                    schemaData={schemaData}
                    tableData={tableData}
                    primaryKey={key.data.pk}
                />
            }
        </div >
    )
}
