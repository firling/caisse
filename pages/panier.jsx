import LignePanier from '@/components/LignePanier';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Panier({}) {
    const { data: session, status } = useSession()
    
    const [total, setTotal] = useState(0);

    const [panier, setPanier] = useState({});

    const refresh = () => {
        fetch(`/api/panier?userId=${session.user.id}`)
            .then(res => res.json())
            .then(setPanier)
    }

    useEffect(() => {
        if (session?.user?.selectedResto) {
            refresh()
        }
    }, [status])

    useEffect(() => {
        setTotal(panier.LignePanier?.reduce((total, ligne) => total + ligne.total, 0))
    }, [panier])

    const confirmCommand = () => {
        fetch('/api/command/notPaid', {
            method: "POST",

            body: JSON.stringify({
                data: {
                    restoId: session?.user?.selectedResto.id,
                    panierId: panier.id,
                }
            }),
     
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            refresh()
        });
    }

    return (
        <div className="relative container mx-auto pb-36">
            
            <div className='p-4 bg-white'>
                <ul className="max-w-md mx-auto divide-y divide-gray-200">
                    {panier.LignePanier?.map((elt, i) => (
                        <LignePanier key={i} elt={elt} refresh={refresh} />
                    ))}
                </ul>
            </div>

            

            <div className='p-4 inset-x-0 bottom-14 fixed bg-white'>
                <button onClick={confirmCommand} class="w-full bg-slate-900 hover:bg-slate-700 text-white font-bold py-4 px-4 rounded">
                    Valider la commande (total : {total}€)
                </button>
            </div>
        </div>
    )
}