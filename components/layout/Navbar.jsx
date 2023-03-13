import { IconBasket, IconHome, IconNotes, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
	const router = useRouter()

	const route = [
		{
			link: "/",
			label: "Home",
			Icon: IconHome,
		},
		{
			link: "/panier",
			label: "Panier",
			Icon: IconBasket,
		},
		{
			link: "#",
			label: "Commande",
			Icon: IconNotes,
		},
		{
			link: "/profil",
			label: "Profil",
			Icon: IconUser,
		},
	]

	const tabs = route.map(({link, label, Icon}, i) => (
		<Link 
			key={i} 
			href={link} 
			className={`
				w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1
				${router.pathname === link && "text-teal-500"}
			`}
		>
			<Icon size="1.5rem" className="inline-block mb-1" />
			<span className="tab tab-home block text-xs">{label}</span>
		</Link>
	))

    return (
		<section id="bottom-navigation" className="block fixed inset-x-0 bottom-0 z-10 bg-white shadow">
			<div id="tabs" className="flex justify-between">
				{tabs}
			</div>
		</section>
    )
}