import CreateRestoModal from '@/components/modal/CreateRestoModal';
import { Button } from '@mantine/core';
import { useState } from 'react'

export default function NoResto({user}) {
  const [createModalOpened, setCreateModalOpened] = useState(false);

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