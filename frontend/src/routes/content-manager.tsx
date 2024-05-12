import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/content-manager')({
    component: ContentManagerComponent
})

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

function ContentManagerComponent() {

    const entities = useQuery({ queryKey: ['get-entities'], queryFn: getEntities })

    if (entities.error) return "An error has occurred : " + entities.error.message

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
                                            <li className='mb-2 cursor-pointer'><Link to="/content-manager/$entity" params={{ entity }} className='[&.active]:text-primary'>{entity}</Link></li>
                                        </ul>
                                    })
                            }
                        </nav>
                    </div>
                </div>
            </div>

            <Outlet />

        </div >
    )
}
