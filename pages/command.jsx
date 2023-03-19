import LigneCommand from '@/components/LigneCommand';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Command({}) {
    const { data: session, status } = useSession()

    const [commands, setCommands] = useState([])

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

    return (
        <div className="relative container mx-auto pb-16 px-4">
            
            {commands?.map((elt, i) => (
                <LigneCommand key={i} elt={elt} />
            ))}

        </div>
    )
}