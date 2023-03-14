import CreateDishModal from '@/components/modal/CreateDishModal';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import colorVariants from '../../utils/colors';

export default function Category() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [dishOpened, setDishOpened] = useState(false);
    const [category, setCategory] = useState(null);

    const refresh = () => {
        fetch(`/api/resto/category/${router.query.id}`)
            .then(res => res.json())
            .then(setCategory)
    }

    useEffect(() => {
        refresh()
    }, [status])

    if (!category) return <>Loading...</>;

    const cards = category.dishes.map((elt, i) => (
        <div 
            key={i} 
            className="flex flex-wrap justify-center gap-2"
        >
            <a 
                className={`flex items-center justify-center w-44 h-32 max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 overflow-hidden`}
                onClick={() => router.push(`/dish/${elt.id}`)}
            >
                {elt.image && 
                    <Image className='opacity-30' alt="dish image" src={elt.image} width="200" height="200"/>
                }
                <h6 className={`text-xl font-medium tracking-tight text-gray-900 absolute`}>{elt.name}</h6>
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
            <CreateDishModal 
                opened={dishOpened} 
                onClose={() => setDishOpened(false)} 
                refresh={refresh}
                restoId={session.user?.selectedResto.id} 
                categoryId={category.id} 
            />
        </div>
    )
}