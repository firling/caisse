import CreateCategoryModal from '@/components/modal/CreateCategoryModal';
import CreateRestoModal from '@/components/modal/CreateRestoModal';
import prisma from '@/lib/prisma';
import { Button } from '@mantine/core';
import { getServerSession } from 'next-auth'
import { useRouter } from 'next/router';
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { useState } from 'react'

import colorVariants from '../utils/colors';

export default function Home({user, categories}) {
  const [createModalOpened, setCreateModalOpened] = useState(false);
  
  const [createCatOpened, setCreateCatOpened] = useState(false);

  const router = useRouter()

  if (!user?.selectedResto) {
    return (
      <div className='container m-auto text-center'>
        <p>Vous n'avez pas encore configuré de restaurant.</p>
        
        <Button
          mt="md"
          variant="outline" 
          radius="md" 
          size="md"
          onClick={() => setCreateModalOpened(true)}
        >
          Créez votre restaurant
        </Button>

        <CreateRestoModal 
          opened={createModalOpened} 
          onClose={() => setCreateModalOpened(false)} refresh={() => console.log("refresh")} 
          userId={user?.id}
        />
      </div>
    )
  }

  const cards = categories.map((elt, i) => (
    <a 
      key={i} 
      className={`flex items-center justify-center w-44 h-32 max-w-sm p-6 ${colorVariants[elt.color].bg} border border-gray-200 rounded-lg shadow ${colorVariants[elt.color].bgHover}`}
      onClick={() => router.push(`/category/${elt.id}`)}
    >
      <h6 className="text-xl font-bold tracking-tight text-gray-900">{elt.name}</h6>
    </a>
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
          onClose={() => setCreateCatOpened(false)} refresh={() => console.log("refresh")} 
          restoId={user?.selectedResto?.id}
          colorVariants={colorVariants}
      />
    </div>
  )
}


export const getServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  var categories = []

  if (session.user?.selectedResto) {
    categories = await prisma.category.findMany({
      where: {restoId: session.user?.selectedResto.id},
      select: {
        id: true,
        name: true,
        color: true,
        type: true
      }
    })
  }

  return { 
    props: {
      user: session.user,
      categories,
    }
  }
}