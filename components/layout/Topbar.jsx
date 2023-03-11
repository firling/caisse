import { IconChevronLeft } from "@tabler/icons-react";

export default function Topbar({title}) {
    return (
        <header className="header sticky top-0 bg-white shadow-md flex items-center justify-between px-4 py-02">
            <h1 className="w-3/12">
                {false && <IconChevronLeft />}
            </h1>

            <nav className="nav font-semibold text-lg">
                <h2 className="p-4">
                    {title}
                </h2>
            </nav>

            <div className="w-3/12 flex justify-end">
                
            </div>
        </header>
    )
}