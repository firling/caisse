import { Textarea } from '@mantine/core';
import { useCounter } from '@mantine/hooks';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Dish() {
    const { data: session, status } = useSession()
    const router = useRouter();

    const [count, handlers] = useCounter(1, { min: 1 });
    const [informations, setInformations] = useState("");
    const [dish, setDish] = useState(null);

    useEffect(() => {
        if (session?.user?.selectedResto) {
          fetch(`/api/resto/dish?id=${router.query.id}`)
            .then(res => res.json())
            .then(setDish)
        }
    }, [status])

    const addToPanier = () => {
        fetch('/api/panier/', {
            method: "POST",

            body: JSON.stringify({
                data: {
                    userId: session?.user.id,
                    dishId: dish.id,
                    quantity: count,
                    dishPrice: dish.price,
                    informations: informations.replaceAll('\n', '\\n'),
                }
            }),
     
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            router.back();
        });
    }

    if (!dish) return <>Loading...</>;

    return (
        <div className="relative container mx-auto pb-36">
            {dish.image && 
                <div 
                    className='h-40 w-full'
                    style={{
                        background: `center / cover no-repeat url("${dish.image}")`,
                    }}
                />
            }
            <div className='p-4 bg-white'>
                <h3 className='text-2xl font-semibold'>{dish.name}</h3>
                <h3 className='text-lg font-semibold'>{dish.price.toFixed(2)}€</h3>
                <p className='mt-1 text-sm text-slate-500'>
                    {dish.description.split('\\n').map(elt => <>
                        {elt} <br />
                    </>)}
                </p>
            </div>

            <div className='p-4 mt-3 bg-white'>
                <div className="flex flex-row h-10 w-40 rounded-lg relative bg-transparent mt-1">
                    <button 
                        onClick={handlers.decrement} 
                        disabled={count === 1} 
                        className={`bg-gray-200 ${count === 1 ? "text-gray-400" : "text-gray-800"} hover:text-gray-900 hover:bg-gray-300 h-full w-20 rounded-l-full cursor-pointer outline-none`}>
                        <span className="m-auto text-2xl font-thin">−</span>
                    </button>
                    <input 
                        type="number" 
                        className="outline-none focus:outline-none text-center w-full bg-gray-200 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-800  outline-none" 
                        name="custom-input-number" 
                        value={count} 
                        onChange={() => null}
                    />
                    <button onClick={handlers.increment}  className="bg-gray-200 text-gray-800 hover:text-gray-900 hover:bg-gray-300 h-full w-20 rounded-r-full cursor-pointer">
                        <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                </div>
            </div>

            <div className='p-4 mt-3 bg-white'>
                <Textarea 
                    label='Informations complémentaires'
                    placeholder='Supplément ... Sans ...'
                    autosize
                    minRows={2}
                    value={informations}
                    onChange={(e) => setInformations(e.currentTarget.value)}
                />
            </div>

            <div className='p-4 inset-x-0 bottom-14 fixed bg-white'>
                <button onClick={addToPanier} class="w-full bg-slate-900 hover:bg-slate-700 text-white font-bold py-4 px-4 rounded">
                    Ajouter {count} au panier - {(dish.price * count).toFixed(2)}€
                </button>
            </div>
        </div>
    )
}