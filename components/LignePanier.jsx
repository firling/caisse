import { useCounter } from '@mantine/hooks';
import Image from 'next/image';

export default function LignePanier({elt}) {
    const [count, handlers] = useCounter(elt.quantity, { min: 1 });

    return (
        <li className="py-2">
            <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {elt.dish.name}
                    </p>
                    {elt.informations && (
                        <p className="text-sm text-gray-500 truncate">
                            {elt.informations.split('\\n').map(elt => <>{elt}<br /></>)}
                        </p>
                    )}
                </div>
                
                <div className="flex-shrink-0">
                    <Image 
                        className="w-8 h-8 rounded-full"
                        height={200}
                        width={200}
                        src={elt.dish.image}
                    />
                </div>
            </div>
            
            <div className="mt-2 flex items-center space-x-4">
                <div className='flex-1 bg-white'>
                    <div className="flex flex-row h-10 w-32 rounded-lg relative bg-transparent mt-1">
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
                        />
                        <button onClick={handlers.increment}  className="bg-gray-200 text-gray-800 hover:text-gray-900 hover:bg-gray-300 h-full w-20 rounded-r-full cursor-pointer">
                            <span className="m-auto text-2xl font-thin">+</span>
                        </button>
                    </div>
                </div>
                <div className="flex-shrink-0 inline-flex items-center text-base font-semibold text-gray-900">
                    {elt.total.toFixed(2)}€
                </div>
            </div>
        </li>
    )
}
