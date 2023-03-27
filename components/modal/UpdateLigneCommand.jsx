import { Button, Group, Modal } from '@mantine/core';

export default function UpdateLigneCommandModal({opened, onClose, ligne}) {

    console.log(ligne)
    return (
        <Modal opened={opened} onClose={onClose} title="Changer l'état d'une commande" centered>
            
            <div className="mb-6">

                tructruc

                <Group position="apart" mt="md">
                    <Button 
                        variant="outline"
                        color="blue"
                    >Truc</Button>
                    <Button 
                        variant="outline"
                        color="blue"
                    >Truc</Button>
                </Group>
            </div> 
        </Modal>
    )
}