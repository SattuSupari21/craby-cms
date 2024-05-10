import { ModeToggle } from '@/components/mode-toggle'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
    component: () => (
        <>
            <div className="p-2 flex items-center justify-between gap-2">
                <Link to="/" className="[&.active]:font-bold">
                    Home
                </Link>
                <ModeToggle />
            </div>
            <hr />
            <Outlet />
        </>
    ),
})
