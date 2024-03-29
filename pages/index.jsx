import CreateCategoryModal from '@/components/modal/CreateCategoryModal';
import NoResto from '@/components/NoResto';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'

import colorVariants from '../utils/colors';

export default function Home() {
  const { data: session, status } = useSession()
  
  const [createCatOpened, setCreateCatOpened] = useState(false);
  const [categories, setCategories] = useState([]);

  const router = useRouter()

  const refresh = () => {
    fetch(`/api/resto/category?restoId=${session.user.selectedResto.id}`)
      .then(res => res.json())
      .then(setCategories)
  }

  useEffect(() => {
    if (session?.user?.selectedResto) {
      refresh()
    }
  }, [status])

  if (!session?.user?.selectedResto) {
    return <NoResto refresh={refresh} user={session?.user} />
  }

  const cards = categories.map((elt, i) => (
    <div key={i} className="flex flex-wrap justify-center gap-2">
      <a 
        className={`flex items-center justify-center w-44 h-32 max-w-sm p-6 ${colorVariants[elt.color].bg} border border-gray-200 rounded-lg shadow ${colorVariants[elt.color].bgHover}`}
        onClick={() => router.push(`/category/${elt.id}`)}
      >
        <h6 className="text-xl font-bold tracking-tight text-gray-900">{elt.name}</h6>
      </a>
    </div>
  ))

  return (
    <div className="container mx-auto mt-4 pb-16">
      <div className="flex flex-wrap justify-center gap-2">
        <a onClick={() => setCreateCatOpened(true)} className="flex items-center justify-center w-44 h-32 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
          <h6 className="text-2xl font-bold tracking-tight text-gray-900">+</h6>
        </a>
        {cards}
      </div>
      <CreateCategoryModal 
          opened={createCatOpened} 
          onClose={() => setCreateCatOpened(false)} 
          refresh={refresh} 
          restoId={session.user?.selectedResto?.id}
          colorVariants={colorVariants}
      />
    </div>
  )
}