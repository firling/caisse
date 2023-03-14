import { Button, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function CreateRestoModal({opened, onClose, userId, refresh}) {

    const form = useForm({
      initialValues: {
        name: '',
      },
  
      validate: {
        name: (value) => (value.length > 0 ? null : 'Le nom est requis'),
      },
    });

    const onSubmit = (values) => {
        fetch('/api/resto/', {
            method: "POST",

            body: JSON.stringify({
                userId,
                data: values
            }),
     
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => {
            refresh()
            onClose()
        });
    }
    return (
        <Modal opened={opened} onClose={onClose} title="Créez votre restaurant" centered>
            
            <div className="mb-6">
                <form onSubmit={form.onSubmit(onSubmit)}>
                    <TextInput
                        placeholder="Exemple"
                        label="Nom du restaurant"
                        withAsterisk
                        {...form.getInputProps('name')}
                    />

                    <Group position="right" mt="md">
                        <Button 
                            type='submit'
                            variant="outline"
                            color="blue"
                        >Créer</Button>
                    </Group>
                </form>
            </div> 
        </Modal>
    )
}