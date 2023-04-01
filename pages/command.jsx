import LigneCommand from '@/components/LigneCommand';
import UpdateLigneCommandModal from '@/components/modal/UpdateLigneCommand';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Command({}) {
    const { data: session, status } = useSession()

    const [commands, setCommands] = useState([])
    const [filter, setFilter] = useState(["all"])

    const [updateLigneOpened, setUpdateLigneOpened] = useState(false)
    const [currentLigne, setCurrentLigne] = useState({})

    const refresh = () => {
        fetch(`/api/command/all?restoId=${session?.user?.selectedResto.id}`)
            .then(res => res.json())
            .then(setCommands)
    }

    useEffect(() => {
        if (session?.user?.selectedResto) {
            refresh()
        }
    }, [status])

    const clickFilter = (state) => {
        if (state === 'all') return setFilter(['all'])
        if (filter.includes(state)) {
            if (filter.length === 1) return setFilter(['all'])
            return setFilter(filter.filter(elt => elt !== state))
        }
        if (filter.length === 3) return setFilter(['all'])
        setFilter([...filter.filter(elt => elt !== "all"), state])
    }

    const getCommands = () => {
        if (filter.includes('all')) return commands
        return commands.filter(elt => filter.includes(elt.state))
    }

    const clickCommand = (elt) => {
        setCurrentLigne(elt)
        setUpdateLigneOpened(true)
    }

    return (
        <div className="relative container mx-auto pb-16 px-4">
            <div className='mt-2'>
                <span onClick={() => clickFilter("notPaid")} className={`cursor-pointer bg-stone-300 text-stone-900 text-xs mr-2 px-2.5 py-0.5 rounded border-stone-900 ${filter.includes("notPaid") && "border font-semibold"}`}>Non Payée</span>
                <span onClick={() => clickFilter("paid")} className={`cursor-pointer bg-orange-300 text-orange-900 text-xs mr-2 px-2.5 py-0.5 rounded border-orange-900 ${filter.includes("paid") && "border font-semibold"}`}>Payée</span>
                <span onClick={() => clickFilter("finished")} className={`cursor-pointer bg-lime-300 text-lime-900 text-xs mr-2 px-2.5 py-0.5 rounded border-lime-900 ${filter.includes("finished") && "border font-semibold"}`}>Prête</span>
                <span onClick={() => clickFilter("given")} className={`cursor-pointer bg-sky-300 text-sky-900 text-xs mr-2 px-2.5 py-0.5 rounded border-sky-900 ${filter.includes("given") && "border font-semibold"}`}>Livrée</span>
                <span onClick={() => clickFilter("all")} className={`cursor-pointer bg-white text-black text-xs mr-2 px-2.5 py-0.5 rounded border-black ${filter.includes("all") && "border font-semibold"}`}>Toutes</span>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
                {getCommands().map((elt, i) => (
                    <LigneCommand key={i} elt={elt} onClick={() => clickCommand(elt)} />
                ))}
            </div>

            <UpdateLigneCommandModal 
                opened={updateLigneOpened} 
                onClose={() => setUpdateLigneOpened(false)}
                ligne={currentLigne}
                refresh={refresh}
            />

        </div>
    )
}