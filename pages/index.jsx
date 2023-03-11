import CreateRestoModal from '@/components/modal/CreateRestoModal';
import { Button } from '@mantine/core';
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { useState } from 'react'

export default function Home({user}) {
  const [createModalOpened, setCreateModalOpened] = useState(false);

  if (!user?.selectedResto) {
    return (
      <div className='container m-auto py-4 text-center'>
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

  return (
    <>
      Home
    </>
  )
}


export const getServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  return { 
    props: {
      user: session.user
    }
  }
}