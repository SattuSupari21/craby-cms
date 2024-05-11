import { Button } from '@/components/ui/button'
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
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/content-types')({
    component: ContentTypeComponent
})

const schemaData = {
    "columns": [
        "id",
        "mobile",
        "name",
        "email"
    ],
    "dataTypes": [
        "uuid",
        "numeric",
        "text",
        "text"
    ]
};

function TableLoadingSkeleton() {
    return (
        <div className='flex flex-col gap-12 p-4'>
            <div className='w-full flex items-center justify-between'>
                <div className='flex flex-col gap-1'>
                    <span className='text-4xl font-medium'>Person</span>
                    <span className='text-sm'>0 entries found</span>
                </div>
                <Button variant={'outline'} className='rounded-sm border-primary text-primary'><PlusIcon className='w-6 h-6 mr-2' />Add another field</Button>
            </div>

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

function RenderEntityData() {
    return (
        <div className='flex flex-col gap-12 p-4'>
            <div className='w-full flex items-center justify-between'>
                <div className='flex flex-col gap-1'>
                    <span className='text-4xl font-medium'>Person</span>
                    <span className='text-sm'>0 entries found</span>
                </div>
                <Button variant={'outline'} className='rounded-sm border-primary text-primary'><PlusIcon className='w-6 h-6 mr-2' />Add another field</Button>
            </div>

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
                        schemaData.columns.map((_, index) => {
                            return <TableRow key={index}>
                                <TableCell>{schemaData.columns[index]}</TableCell>
                                <TableCell>{schemaData.dataTypes[index].toUpperCase()}</TableCell>
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
        </div>
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

async function getSchema() {
    const res = await fetch("http://127.0.0.1:3000/api/entity/getTableSchema", { method: "POST", body: JSON.stringify({ "table_name": "person" }) })
    if (!res.ok) {
        throw new Error()
    }
    const data = await res.json()
    if (data.error) {
        throw new Error()
    }
    return data
}

function ContentTypeComponent() {

    const entities = useQuery({ queryKey: ['get-entities'], queryFn: getEntities })
    const schemaData = useQuery({ queryKey: ['get-schema'], queryFn: getSchema })

    if (entities.error) return "An error has occurred : " + entities.error.message
    if (schemaData.error) return "An error has occurred : " + schemaData.error.message

    return (
        <div className="grid min-h-screen w-full grid-cols-[240px_1fr]">
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
                                            <li className='mb-2 cursor-pointer'>{entity}</li>
                                        </ul>
                                    })}
                        </nav>
                        <Button variant={'link'}><PlusIcon className='w-4 h-4 mr-2' />Create new content type</Button>
                    </div>
                </div>
            </div>

            <div>
                {
                    schemaData.isPending ? <TableLoadingSkeleton /> : schemaData.data.columns.length < 0 ?
                        <div className='w-full h-full flex flex-col items-center justify-center gap-2'>
                            <span className='text-xl'>No Schema Found</span>
                            <Button><PlusIcon className='w-4 h-4 mr-2' />Create Schema</Button>
                        </div>
                        : <RenderEntityData />
                }
            </div>
        </div >
    )
}
