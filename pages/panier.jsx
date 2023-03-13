import LignePanier from '@/components/LignePanier';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth'
import Image from 'next/image';
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { useEffect, useState } from 'react';

export default function Panier({user, lignePanier}) {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setTotal(lignePanier.reduce((total, ligne) => total + ligne.total, 0))
    }, [lignePanier])

    return (
        <div className="relative container mx-auto pb-36">
            
            <div className='p-4 bg-white'>
                <ul className="max-w-md mx-auto divide-y divide-gray-200">
                    {lignePanier.map((elt, i) => (
                        <LignePanier key={i} elt={elt}/>
                    ))}
                </ul>
            </div>

            

            <div className='p-4 inset-x-0 bottom-14 fixed bg-white'>
                <button onClick={console.log} class="w-full bg-slate-900 hover:bg-slate-700 text-white font-bold py-4 px-4 rounded">
                    Valider la commande (total : {total}€)
                </button>
            </div>
        </div>
    )
}


export const getServerSideProps = async (ctx) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)

    var panier = await prisma.panier.findFirst({
        where: {
            userId: session.user.id,
            active: true
        },
    })

    if (!panier) {
        panier = await prisma.panier.create({
            data: {
                userId: session.user.id,
                active: true
            }
        })
    }

    const lignePanier = await prisma.lignePanier.findMany({
        where: {
            panierId: panier.id
        },
        select: {
            id: true,
            quantity: true,
            total: true,
            informations: true,
            dish: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            }
        }
    })

    return { 
        props: {
            user: session.user,
            lignePanier,
        }
    }
}