import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/content-types/new')({
    component: NewEntityComponent
})

function NewEntityComponent() {
    return (
        <div className='flex flex-col gap-2 p-8'>
            <Link to='/content-types' className='flex gap-2 text-primary'><ArrowLeft />Back</Link>
            <div className='w-full flex items-center justify-between'>
                <div className='flex flex-col gap-1'>
                    <span className='text-4xl font-medium'>Create New Entity</span>
                </div>
            </div>
            <Card className='max-w-4xl mt-12 flex flex-col gap-6 p-4'>
                <div className='space-y-2'>
                    <span>Entity name</span>
                    <Input type="text" />
                </div>
                <div className='flex flex-col gap-2 mt-2'>
                    <span>Create a new field for your entity</span>
                    <div className='flex gap-2 items-center'>
                        <div className='flex-1'>
                            <span>Name</span>
                            <Input type="text" />
                        </div>
                        <div className='flex-1'>
                            <span>Select type of field</span>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="uuid">UUID</SelectItem>
                                    <SelectItem value="serial">Serial</SelectItem>
                                    <SelectItem value="number">Numeric</SelectItem>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <div className='flex-1'>
                            <span>Default value</span>
                            <Input type='text' />
                        </div>
                        <div className='flex-1 flex items-center justify-evenly'>
                            <div className='space-x-2'>
                                <Checkbox id="primary" />
                                <span>Primary</span>
                            </div>
                            <div className='space-x-2'>
                                <Checkbox id="unique" />
                                <span>Unique</span>
                            </div>
                            <div className='space-x-2'>
                                <Checkbox id="notNull" />
                                <span>Not Null</span>
                            </div>

                        </div>
                    </div>
                </div>
                <Button>Finish</Button>
            </Card>
        </div>
    )
}
