import { Button } from '@/components/ui/button'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { PlusIcon, Trash } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@tanstack/react-router'
import { toast } from '@/components/ui/use-toast'

export const Route = createFileRoute('/content-types/$entity')({
    component: Component,
})

async function getSchema(entity: string) {
    // await new Promise(h => setTimeout(h, 2000))
    const res = await fetch("http://127.0.0.1:3000/api/entity/getTableSchema", {
        method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "table_name": entity })
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

function TableLoadingSkeleton() {
    return (
        <div className='flex flex-col gap-12 p-4'>
            <Table className='bg-card rounded-md'>
                <TableCaption>Schema of your Entity.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        Array(3).fill(0).map((_, index) => {
                            return <TableRow key={index}>
                                <TableCell><Skeleton className="h-[20px] mb-2 rounded-full" />
                                </TableCell>
                                <TableCell><Skeleton className="h-[20px] mb-2 rounded-full" />
                                </TableCell>
                                <TableCell className='flex'>
                                    <Skeleton className="h-[20px] mb-2 rounded-full" />
                                    <Skeleton className="h-[20px] mb-2 rounded-full" />
                                </TableCell>
                            </TableRow>
                        })
                    }
                </TableBody>
            </Table>
        </div>
    )
}

function RenderEntityData({ schemaData }: { schemaData: UseQueryResult<any, Error> }) {
    return (
        <div className='flex flex-col gap-12 p-4'>
            <Table className='bg-card rounded-md'>
                <TableCaption>Schema of your Entity.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        schemaData.data.columns.map((_: string, index: number) => {
                            return <TableRow key={index}>
                                <TableCell>{
                                    schemaData.data.columns[index]
                                }</TableCell>
                                <TableCell>{schemaData.data.dataTypes[index].toUpperCase()}</TableCell>
                                {/*<TableCell className='flex'>
                                    <div className='ml-auto flex gap-2'>
                                        <Button variant={'outline'} ><Edit2Icon className='w-4 h-4' /></Button>
                                        <Button variant={'outline'} ><Trash className='w-4 h-4' /></Button>
                                    </div>
                                </TableCell>*/}
                            </TableRow>
                        })
                    }
                </TableBody>
            </Table>
        </div>
    )
}

async function deleteEntity(entity: string) {
    const res = await fetch("http://127.0.0.1:3000/api/entity/deleteTable", {
        method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "table_name": entity })
    })
    if (!res.ok) {
        return toast({ title: "Error", description: "An error occurred" })
    }
    const data = await res.json()
    if (data.error) {
        return toast({ title: "Error", description: "An error occurred" })
    }
    return toast({ title: "Success", description: "Entity deleted successfully" })
}

function Component() {

    const { entity } = Route.useParams();
    const schemaData = useQuery({ queryKey: ['get-schema'], queryFn: () => getSchema(entity) })

    schemaData.refetch()

    return (
        <div className='flex flex-col gap-12 p-8'>
            <div className='w-full flex items-center justify-between'>
                <div className='flex flex-col gap-1'>
                    <span className='text-4xl font-medium'>{entity}</span>
                    <span className='text-sm mt-1'>Build the data architecture of your content</span>
                </div>
                <div className='space-x-2'>
                    <Button variant={'outline'} className='rounded-sm border-red-500 text-red-500' onClick={() => deleteEntity(entity)}>
                        <Trash className='w-6 h-6 mr-2' />
                        Delete Entity
                    </Button>

                    <Link to='/content-types/$entity/create' params={{ entity }}>
                        <Button variant={'outline'} className='rounded-sm border-primary text-primary'>
                            <PlusIcon className='w-6 h-6 mr-2' />
                            Add another field
                        </Button>
                    </Link>
                </div>
            </div>

            {
                schemaData.isPending ? <TableLoadingSkeleton /> : <RenderEntityData schemaData={schemaData} />
            }
        </div>
    )
}
