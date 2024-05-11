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

export const Route = createFileRoute('/content-manager')({
    component: ContentManagerComponent
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

const tableData = {
    "data": [
        {
            "id": "2f4974bd-1ae8-4102-be06-7fa4945411c2",
            "name": "samtu",
            "email": "s@s.com",
            "mobile": "8272625142"
        },
        {
            "id": "9f3d5bce-6bab-4766-89d8-c858945a7551",
            "name": "aaa",
            "email": "a@a.com",
            "mobile": "1231231231"
        }
    ]
}

function RenderEntityData() {
    return (
        <div className='flex flex-col gap-12 p-4'>
            <div className='w-full flex items-center justify-between'>
                <div className='flex flex-col gap-1'>
                    <span className='text-4xl font-medium'>Person</span>
                    <span className='text-sm'>0 entries found</span>
                </div>
                <Button className='rounded-sm'><PlusIcon className='w-6 h-6 mr-2' />Create new entry</Button>
            </div>

            <Table className='bg-card rounded-md'>
                <TableCaption>All your entries in table.</TableCaption>
                <TableHeader>
                    <TableRow>
                        {
                            schemaData.columns.map((value, index) => {
                                return <TableHead key={index}>{value.toUpperCase()}</TableHead>
                            })
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        tableData.data.map((data) => {
                            return <TableRow>
                                {
                                    schemaData.columns.map((col) => {
                                        // @ts-ignore
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

function ContentManagerComponent() {
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
                                entities.tables.length < 0 ?
                                    <span>No entities found</span> :
                                    entities.tables.map((entity, index) => {
                                        return <ul key={index} className='list-disc list-inside'>
                                            <li className='mb-2 cursor-pointer'>{entity}</li>
                                        </ul>
                                    })
                            }
                        </nav>
                    </div>
                </div>
            </div>

            <div>
                {
                    tableData.data.length < 0 ?
                        <div className='w-full h-full flex flex-col items-center justify-center gap-2'>
                            <span className='text-xl'>No data in table</span>
                            <Button><PlusIcon className='w-4 h-4 mr-2' />Add new entry</Button>
                        </div>
                        : <RenderEntityData />
                }
            </div>
        </div >
    )
}
