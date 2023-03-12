import CreateDishModal from '@/components/modal/CreateDishModal';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { useState } from 'react';

import colorVariants from '../../utils/colors';

export default function Category({user, category, dishes}) {
    const [dishOpened, setDishOpened] = useState(false);

    const cards = dishes.map((elt, i) => (
        <div 
            key={i} 
            className="flex flex-wrap justify-center gap-2"
        >
            <a 
                className={`flex items-center justify-center w-44 h-32 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100`}
                style={{
                    background: `center / cover no-repeat url("${elt.image}")`,
                }}
            >
                <h6 className={`text-xl font-bold tracking-tight ${elt.image ? "text-white" : "text-gray-900"}`}>{elt.name}</h6>
            </a>
        </div>
    ))

    return (
        <div className="container mx-auto mt-4 pb-16">
            <div className={`mx-4 flex items-center justify-center h-16 ${colorVariants[category.color].bg} border border-gray-200 rounded-lg shadow`}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900">{category.name}</h5>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                <a onClick={() => setDishOpened(true)} className="flex items-center justify-center w-44 h-32 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                    <h6 className="text-2xl font-bold tracking-tight text-gray-900">+</h6>
                </a>
                {cards}
            </div>
            <CreateDishModal opened={dishOpened} onClose={() => setDishOpened(false)} restoId={user?.selectedResto.id} categoryId={category.id} />
        </div>
    )
}


export const getServerSideProps = async (ctx) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)

    const category = await prisma.category.findUnique({
        where: {id: ctx.query.id},
        select: {
            id: true,
            name: true,
            color: true,
            type: true
        }
    })

    const dishes = await prisma.dish.findMany({
        where: {categoryId: category.id},
        select: {
            id: true,
            name: true,
            image: true,
        }
    })

    return { 
        props: {
            user: session.user,
            category,
            dishes,
        }
    }
}