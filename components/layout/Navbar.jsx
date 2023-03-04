import { IconCategory, IconGift, IconHome, IconSearch, IconUser } from "@tabler/icons-react";

export default function Navbar() {
    return (
	<section id="bottom-navigation" className="block fixed inset-x-0 bottom-0 z-10 bg-white shadow">
		<div id="tabs" className="flex justify-between">
			<a href="#" className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
				<IconHome size="1.5rem" className="inline-block mb-1" />
				<span className="tab tab-home block text-xs">Home</span>
			</a>
			<a href="#" className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
                <IconCategory size="1.5rem" className="inline-block mb-1" />
				<span className="tab tab-home block text-xs">Home</span>
			</a>
			<a href="#" className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
				<IconSearch size="1.5rem" className="inline-block mb-1" />
				<span className="tab tab-home block text-xs">Home</span>
			</a>
			<a href="#" className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
				<IconGift size="1.5rem" className="inline-block mb-1" />
				<span className="tab tab-home block text-xs">Home</span>
			</a>
			<a href="#" className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
                <IconUser size="1.5rem" className="inline-block mb-1" />
				<span className="tab tab-home block text-xs">Profil</span>
			</a>
		</div>
	</section>
    )
}