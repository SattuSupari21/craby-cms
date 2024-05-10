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

export const Route = createFileRoute('/content-types')({
    component: ContentTypeComponent
})

const entities = {
    "tables": [
        "person",
        "admins"
    ]
}

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

function ContentTypeComponent() {
    return (
        <div className="grid min-h-screen w-full grid-cols-[240px_1fr]">
            <div className="hidden border-r lg:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center px-6">
                        <span className='font-medium text-lg'>Content Types</span>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-8 text-sm font-medium space-y-1">
                            {
                                entities.tables.map((entity, index) => {
                                    return <ul key={index} className='list-disc list-inside'>
                                        <li className='mb-2 cursor-pointer'>{entity}</li>
                                    </ul>
                                })
                            }
                        </nav>
                        <Button variant={'link'}><PlusIcon className='w-4 h-4 mr-2' />Create new content type</Button>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-12 p-4'>
                <div className='w-full flex items-center justify-between'>
                    <div className='flex flex-col gap-1'>
                        <span className='text-4xl font-medium'>Person</span>
                        <span className='text-sm'>0 entries found</span>
                    </div>
                    <Button variant={'outline'} className='rounded-sm border-primary text-primary'><PlusIcon className='w-6 h-6 mr-2' />Add another field</Button>
                </div>

                <Table className='bg-card rounded-md'>
                    <TableCaption>A list of your Entities.</TableCaption>
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
        </div >
    )
}
