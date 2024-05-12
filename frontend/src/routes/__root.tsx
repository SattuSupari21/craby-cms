import { ModeToggle } from '@/components/mode-toggle'
import { Toaster } from '@/components/ui/toaster'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { Package2Icon, HomeIcon, PackageIcon, UserIcon, ArrowRight } from 'lucide-react'

export const Route = createRootRoute({
    component: Component
})

export default function Component() {
    return (
        <div className="grid min-h-screen w-full grid-cols-[240px_1fr]">
            <div className="hidden border-r lg:block bg-card">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-4">
                        <Link className="w-full flex items-center justify-between font-semibold" href="#">
                            <div className='flex gap-2'>
                                <Package2Icon className="h-6 w-6" />
                                <span>Craby CMS</span>
                            </div>
                            <ModeToggle />
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-2 text-sm font-medium space-y-1">
                            <Link
                                to="/content-manager"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all [&.active]:bg-secondary hover:bg-secondary"
                            >
                                <HomeIcon className="h-4 w-4" />
                                Content Manager
                            </Link>
                            <Link
                                to="/content-types"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all [&.active]:bg-secondary hover:bg-secondary"
                            >
                                <PackageIcon className="h-4 w-4" />
                                Content Type Builder
                            </Link>
                        </nav>
                    </div>
                    <div className="flex h-[60px] items-center px-2">
                        <Link className="w-full flex items-center gap-2 font-semibold px-3 py-2 transition-all rounded-lg hover:bg-secondary" href="#">
                            <UserIcon className="h-6 w-6" />
                            <span>Account</span>
                            <ArrowRight className='h-6 w-6 ml-auto' />
                        </Link>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    )
}
