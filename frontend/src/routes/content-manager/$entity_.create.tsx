import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/content-manager/$entity/create')({
    component: CreateNewEntryComponent
})

function CreateNewEntryComponent() {
    const { entity } = Route.useParams();

    return (
        <div className='flex flex-col gap-2 p-8'>
            <Link to='/content-manager/$entity' params={{ entity }} className='flex gap-2 text-primary'><ArrowLeft />Back</Link>
            <div className='w-full flex items-center justify-between'>
                <div className='flex flex-col gap-1'>
                    <span className='text-4xl font-medium'>Create an entry</span>
                    <span className='text-sm mt-1'>ENTITY NAME: {entity}</span>
                </div>
            </div>
        </div >
    )
}
