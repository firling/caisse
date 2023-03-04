import { IconChevronLeft } from "@tabler/icons-react";

export default function Topbar() {
    return (
        <header class="header sticky top-0 bg-white shadow-md flex items-center justify-between px-4 py-02">
            <h1 class="w-3/12">
                {false && <IconChevronLeft />}
            </h1>

            <nav class="nav font-semibold text-lg">
                <h2 class="p-4">
                    Caisse
                </h2>
            </nav>

            <div class="w-3/12 flex justify-end">
                
            </div>
        </header>
    )
}